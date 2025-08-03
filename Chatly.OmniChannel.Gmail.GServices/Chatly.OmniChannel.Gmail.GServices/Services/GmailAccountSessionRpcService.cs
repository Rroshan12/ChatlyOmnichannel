using Grpc.Core;
using Chatly.OmniChannel.Gmail.GServices.Interface;
using Chatly.OmniChannel.Gmail.GServices.Model;
using Chatly.OmniChannel.Gmail.GServices.Model.Enum;
using Newtonsoft.Json.Linq;
using System.Web;

namespace Chatly.OmniChannel.Gmail.GServices.Services
{

    public class GmailAccountSessionRpcService : Chatly.OmniChannel.Gmail.GServices.GmailAccountSessionRpc.GmailAccountSessionRpcBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _config;

        public GmailAccountSessionRpcService(IUnitOfWork unitOfWork, IConfiguration config)
        {
            _unitOfWork = unitOfWork;
            _config = config;
        }

        public override async Task<GmailAccountSessionListResponse> GetAllSessions(Empty request, ServerCallContext context)
        {
            var entity = await _unitOfWork.GmailAccountSessionRepository.GetAll();
            if (entity == null)
                throw new RpcException(new Status(StatusCode.NotFound, "Session not found"));
            var response = new GmailAccountSessionListResponse();
            response.Sessions.AddRange(entity.Select(MapToResVM)); // MapToVM maps entity to GmailAccountSessionVM
            return  response;
        }

        public override async Task<GmailAccountSessionVM> GetSession(SessionIdRequest request, ServerCallContext context)
        {
            var id = Guid.Parse(request.Id);
            var entity = await _unitOfWork.GmailAccountSessionRepository.GetById(id);
            if (entity == null)
                throw new RpcException(new Status(StatusCode.NotFound, "Session not found"));

            return MapToVM(entity);
        }

        public override async Task<GmailAccountSessionVM> CreateSession(GmailAccountSessionVM request, ServerCallContext context)
        {
            var entity = MapToEntity(request);
            await _unitOfWork.GmailAccountSessionRepository.Insert(entity);
            await _unitOfWork.SaveAsync();

            return MapToVM(entity);
        }

        public override async Task<Empty> UpdateSession(GmailAccountSessionVM request, ServerCallContext context)
        {
            var entity = MapToEntity(request);
            _unitOfWork.GmailAccountSessionRepository.Update(entity);
            await _unitOfWork.SaveAsync();

            return new Empty();
        }

        public override async Task<Empty> DeleteSession(GmailAccountSessionVM request, ServerCallContext context)
        {
            var id = Guid.Parse(request.Id);
            var entity = await _unitOfWork.GmailAccountSessionRepository.GetById(id);

            if (entity == null)
                throw new RpcException(new Status(StatusCode.NotFound, "Session not found"));

            entity.IsActive = false; // Soft delete logic, if applicable
            entity.Status = ConnectionStatus.NotConnected;
            _unitOfWork.GmailAccountSessionRepository.Update(entity);
            await _unitOfWork.SaveAsync();

            return new Empty();
        }


        public override async  Task<GoogleAuthUrlResponse> GetGoogleLoginUrl(Empty request, ServerCallContext context)
        {
            var clientId = _config["Google:ClientId"];
            var redirectUri = _config["Google:RedirectUri"];
            var scopes = string.Join(" ", new[]
            {
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.send"
    });

            var authUrl = $"https://accounts.google.com/o/oauth2/v2/auth?" +
                          $"client_id={clientId}" +
                          $"&redirect_uri={HttpUtility.UrlEncode(redirectUri)}" +
                          $"&response_type=code" +
                          $"&scope={HttpUtility.UrlEncode(scopes)}" +
                          $"&access_type=offline" +
                          $"&prompt=consent";

            return   await Task.FromResult(new GoogleAuthUrlResponse { Url = authUrl });
        }

        public override async Task<GoogleCallbackResponse> HandleGoogleCallback(GoogleCallbackRequest request, ServerCallContext context)
        {
            var code = request.Code;
            if (string.IsNullOrEmpty(code))
                throw new RpcException(new Status(StatusCode.InvalidArgument, "Missing code"));

            var clientId = _config["Google:ClientId"];
            var clientSecret = _config["Google:ClientSecret"];
            var redirectUri = _config["Google:RedirectUri"];

            var values = new Dictionary<string, string>
    {
        { "code", code },
        { "client_id", clientId },
        { "client_secret", clientSecret },
        { "redirect_uri", redirectUri },
        { "grant_type", "authorization_code" }
    };

            using var client = new HttpClient();
            var tokenResponse = await client.PostAsync("https://oauth2.googleapis.com/token", new FormUrlEncodedContent(values));
            var tokenJson = JObject.Parse(await tokenResponse.Content.ReadAsStringAsync());

            var accessToken = tokenJson["access_token"]?.ToString();
            var refreshToken = tokenJson["refresh_token"]?.ToString();

            if (string.IsNullOrEmpty(accessToken))
                throw new RpcException(new Status(StatusCode.FailedPrecondition, "Failed to retrieve access token."));

            var userInfoResponse = await client.GetAsync($"https://www.googleapis.com/oauth2/v2/userinfo?access_token={accessToken}");
            var userJson = JObject.Parse(await userInfoResponse.Content.ReadAsStringAsync());

            var gmailAccountSession = new GmailAccountSession
            {
                Id = Guid.NewGuid(),
                UserId = Guid.NewGuid(), // Replace with actual user ID from your context or token jwt
                Email = userJson["email"]?.ToString() ?? "",
                Name = userJson["name"]?.ToString() ?? "",
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                TokenType = tokenJson["token_type"]?.ToString(),
                Scope = tokenJson["scope"]?.ToString(),
                IssuedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddSeconds((double)tokenJson["expires_in"]),
                IsActive = true,
                Status = ConnectionStatus.Connected,
                IsDelated = false // Assuming IsDelated is a property to track deletion status
            };

            var data = (await _unitOfWork.GmailAccountSessionRepository.SelectWhere(x => x.Email == gmailAccountSession.Email)).FirstOrDefault();
            if(data != null)
            {
                data.AccessToken = accessToken;
                data.RefreshToken = refreshToken;
                _unitOfWork.GmailAccountSessionRepository.Update(data);
                await _unitOfWork.SaveAsync();
                return new GoogleCallbackResponse
                {
                    Id= data.Id.ToString(),
                    IsActive = data.IsActive,
                    Status = (int)data.Status,
                    Email = userJson["email"]?.ToString() ?? "",
                    Name = userJson["name"]?.ToString() ?? "",
                    CampaignType = "gmail"
                };
            }
            else
            {
                await _unitOfWork.GmailAccountSessionRepository.Insert(gmailAccountSession);
                await _unitOfWork.SaveAsync();
                return new GoogleCallbackResponse
                {
                    Id = gmailAccountSession.Id.ToString(),
                    IsActive = gmailAccountSession.IsActive,
                    Status = (int)gmailAccountSession.Status,
                    Email = userJson["email"]?.ToString() ?? "",
                    Name = userJson["name"]?.ToString() ?? "",
                    CampaignType = "gmail"
                };
   
            }


    
        }




        // Mapping helpers
        public static  GmailAccountSessionVM MapToVM(GmailAccountSession model)
        {
            return new GmailAccountSessionVM
            {
                Id = model.Id.ToString(),
                UserId = model.UserId.ToString(),
                Email = model.Email,
                Name = model.Name,
                AccessToken = model.AccessToken ?? "",
                RefreshToken = model.RefreshToken ?? "",
                TokenType = model.TokenType ?? "",
                Scope = model.Scope ?? "",
                IssuedAt = model.IssuedAt.ToString("o") ?? "",
                ExpiresAt = model.ExpiresAt.ToString("o") ?? "",
                IsActive = model.IsActive,
                Status = (int)model.Status,
                IsDeleted = model.IsDelated
            };
        }
        public static GmailAccountSessionResponseVM MapToResVM(GmailAccountSession model)
        {
            return new GmailAccountSessionResponseVM
            {
                Id = model.Id.ToString(),
                UserId = model.UserId.ToString(),
                Email = model.Email,
                Name = model.Name,
                IsActive = model.IsActive,
                Status = (int)model.Status,
                IsDeleted = model.IsDelated
            };
        }

        public static GmailAccountSession MapToEntity(GmailAccountSessionVM vm)
        {
            return new GmailAccountSession
            {
                Id = string.IsNullOrEmpty(vm.Id) ? Guid.NewGuid() : Guid.Parse(vm.Id),
                UserId = Guid.Parse(vm.UserId),
                Email = vm.Email,
                Name = vm.Name,
                AccessToken = vm.AccessToken,
                RefreshToken = vm.RefreshToken,
                TokenType = vm.TokenType,
                Scope = vm.Scope,
                IssuedAt = DateTime.Parse(vm.IssuedAt),
                ExpiresAt =  DateTime.Parse(vm.ExpiresAt),
                IsActive = vm.IsActive,
                Status = (ConnectionStatus)vm.Status,
                IsDelated = vm.IsDeleted
            };
        }

   
    }


}
