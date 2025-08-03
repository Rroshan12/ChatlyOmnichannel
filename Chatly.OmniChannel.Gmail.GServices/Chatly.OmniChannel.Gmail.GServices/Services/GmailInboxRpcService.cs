using Grpc.Core;
using Chatly.OmniChannel.Gmail.GServices.Interface;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Text;
using System.Web;

namespace Chatly.OmniChannel.Gmail.GServices.Services
{

    public class GmailInboxRpcService : GmailInboxService.GmailInboxServiceBase
    {
        private readonly HttpClient _httpClient;
        private readonly IUnitOfWork _unitOfWork;

        public GmailInboxRpcService(IUnitOfWork unitOfWork)
        {
            _httpClient = new HttpClient
            {
                BaseAddress = new Uri("https://gmail.googleapis.com/")
            };
            _unitOfWork = unitOfWork;

        }


        public override async Task<GetThreadResponse> GetThreadMessages(GetThreadRequest request, ServerCallContext context)
        {
            if (string.IsNullOrWhiteSpace(request.ThreadId))
                throw new RpcException(new Status(StatusCode.InvalidArgument, "ThreadId is required."));

            if (!Guid.TryParse(request.UserId, out var userGuid))
                throw new RpcException(new Status(StatusCode.InvalidArgument, "Invalid UserId format."));

            var sessions = await _unitOfWork.GmailAccountSessionRepository.SelectWhere(x => x.UserId == userGuid);
            var session = sessions?.FirstOrDefault();

            if (session == null || string.IsNullOrWhiteSpace(session.AccessToken))
                throw new RpcException(new Status(StatusCode.Unauthenticated, "Access token not found."));

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", session.AccessToken);

            try
            {
                var threadUrl = $"https://gmail.googleapis.com/gmail/v1/users/me/threads/{request.ThreadId}?format=full";
                var threadResponse = await _httpClient.GetAsync(threadUrl);

                if (!threadResponse.IsSuccessStatusCode)
                {
                    var error = await threadResponse.Content.ReadAsStringAsync();
                    throw new RpcException(new Status(StatusCode.PermissionDenied, $"Gmail API error: {error}"));
                }

                var threadJson = await threadResponse.Content.ReadAsStringAsync();
                var thread = JsonConvert.DeserializeObject<GmailThread>(threadJson);

                if (thread?.Messages == null || !thread.Messages.Any())
                {
                    return new GetThreadResponse
                    {
                        HtmlContent = "<div>No messages found in this thread</div>",
                        RawJson = threadJson
                    };
                }

                var formattedEmails = new List<string>();
                foreach (var message in thread.Messages)
                {
                    if (message?.Id == null) continue;

                    try
                    {
                        var messageUrl = $"https://gmail.googleapis.com/gmail/v1/users/me/messages/{message.Id}?format=full";
                        var messageResponse = await _httpClient.GetAsync(messageUrl);

                        if (!messageResponse.IsSuccessStatusCode) continue;

                        var messageJson = await messageResponse.Content.ReadAsStringAsync();
                        var email = JsonConvert.DeserializeObject<GmailMessage>(messageJson);

                        if (email != null)
                        {
                            var formattedEmail = FormatEmailAsHtml(email);
                            if (!string.IsNullOrEmpty(formattedEmail))
                            {
                                formattedEmails.Add(formattedEmail);
                            }
                        }
                    }
                    catch
                    {
                        // Skip any problematic messages
                        continue;
                    }
                }

                return new GetThreadResponse
                {
                    HtmlContent = formattedEmails.Any()
                        ? string.Join("<hr/>", formattedEmails)
                        : "<div>No displayable messages found</div>",
                    RawJson = threadJson
                };
            }
            catch (HttpRequestException ex)
            {
                throw new RpcException(new Status(StatusCode.Internal, $"HTTP request failed: {ex.Message}"));
            }
            catch (JsonException ex)
            {
                throw new RpcException(new Status(StatusCode.Internal, $"JSON parsing failed: {ex.Message}"));
            }
        }

        private string FormatEmailAsHtml(GmailMessage email)
        {
            if (email?.Payload?.Headers == null)
            {
                return null;
            }

            try
            {
                var from = email.Payload.Headers?.FirstOrDefault(h => h?.Name == "From")?.Value ?? "Unknown Sender";
                var to = email.Payload.Headers?.FirstOrDefault(h => h?.Name == "To")?.Value ?? "Unknown Recipient";
                var subject = email.Payload.Headers?.FirstOrDefault(h => h?.Name == "Subject")?.Value ?? "No Subject";
                var date = email.Payload.Headers?.FirstOrDefault(h => h?.Name == "Date")?.Value ?? DateTime.UtcNow.ToString();

                var body = FindHtmlPart(email.Payload.Parts) ?? email.Snippet ?? "No message content available";

                return $@"
<div class='email-container'>
    <div class='email-header'>
        <div class='email-subject'>{HttpUtility.HtmlEncode(subject)}</div>
        <div class='email-meta'>
            <div class='email-from'><strong>From:</strong> {HttpUtility.HtmlEncode(from)}</div>
            <div class='email-to'><strong>To:</strong> {HttpUtility.HtmlEncode(to)}</div>
            <div class='email-date'><strong>Date:</strong> {HttpUtility.HtmlEncode(date)}</div>
        </div>
    </div>
    <div class='email-body'>{body}</div>
</div>";
            }
            catch
            {
                return null;
            }
        }

        private string FindHtmlPart(List<MessagePart> parts)
        {
            if (parts == null) return null;

            foreach (var part in parts)
            {
                if (part == null) continue;

                if (part.MimeType == "text/html" && part.Body?.Data != null)
                {
                    var decoded = DecodeBase64(part.Body.Data);
                    if (!string.IsNullOrEmpty(decoded))
                    {
                        return decoded;
                    }
                }

                if (part.Parts != null)
                {
                    var result = FindHtmlPart(part.Parts);
                    if (!string.IsNullOrEmpty(result))
                    {
                        return result;
                    }
                }
            }

            return null;
        }

        private string DecodeBase64(string base64)
        {
            if (string.IsNullOrEmpty(base64)) return null;

            try
            {
                // Gmail API uses URL-safe base64 which needs padding adjustments
                var padded = base64.Replace('-', '+').Replace('_', '/');
                switch (padded.Length % 4)
                {
                    case 2: padded += "=="; break;
                    case 3: padded += "="; break;
                }

                var bytes = Convert.FromBase64String(padded);
                return Encoding.UTF8.GetString(bytes);
            }
            catch
            {
                return null;
            }
        }


        public override async Task<GetInboxResponse> GetInbox(GetInboxRequest request, ServerCallContext context)
        {
            if (!Guid.TryParse(request.UserId, out var userGuid))
            {
                throw new RpcException(new Status(StatusCode.InvalidArgument, "Invalid UserId format."));
            }

            var sessionList = await _unitOfWork.GmailAccountSessionRepository.SelectWhere(x => x.UserId == userGuid);
            var session = sessionList?.FirstOrDefault();

            if (session == null || string.IsNullOrWhiteSpace(session.AccessToken))
            {
                throw new RpcException(new Status(StatusCode.Unauthenticated, "Access token not found for user."));
            }

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", session.AccessToken);

            // Step 1: Get message IDs
            var listUrl = $"gmail/v1/users/me/messages?labelIds=INBOX&maxResults={request.MaxResults}";
            var listRes = await _httpClient.GetAsync(listUrl);
            listRes.EnsureSuccessStatusCode();

            var listJson = await listRes.Content.ReadAsStringAsync();
            var messageList = JsonConvert.DeserializeObject<dynamic>(listJson);

            if (messageList?.messages == null)
            {
                return new GetInboxResponse { RawJson = "[]" };
            }

            var metadataMessages = new List<string>();

            // Step 2: For each message ID, get metadata (like in Node.js example)
            foreach (var msg in messageList.messages)
            {
                string id = msg.id;
                var getUrl = $"gmail/v1/users/me/messages/{id}?format=metadata" +
                             $"&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date&metadataHeaders=Body";

                var msgRes = await _httpClient.GetAsync(getUrl);

                if (msgRes.StatusCode == HttpStatusCode.Forbidden)
                {
                    // skip 403s
                    continue;
                }

                msgRes.EnsureSuccessStatusCode();

                var msgJson = await msgRes.Content.ReadAsStringAsync();
                metadataMessages.Add(msgJson);
            }

            var finalJsonArray = "[" + string.Join(",", metadataMessages) + "]";

            return new GetInboxResponse
            {
                RawJson = finalJsonArray
            };
        }

    }

}



// Helper classes for deserialization
public class GmailThread
{
    public string Id { get; set; }
    public List<GmailMessage> Messages { get; set; }
}

public class GmailMessage
{
    public string Id { get; set; }
    public string Snippet { get; set; }
    public MessagePayload Payload { get; set; }
}

public class MessagePayload
{
    public string MimeType { get; set; }
    public List<MessageHeader> Headers { get; set; }
    public MessageBody Body { get; set; }
    public List<MessagePart> Parts { get; set; }
}

public class MessageHeader
{
    public string Name { get; set; }
    public string Value { get; set; }
}

public class MessageBody
{
    public string Data { get; set; }
}

public class MessagePart
{
    public string MimeType { get; set; }
    public MessageBody Body { get; set; }
    public List<MessagePart> Parts { get; set; }
}