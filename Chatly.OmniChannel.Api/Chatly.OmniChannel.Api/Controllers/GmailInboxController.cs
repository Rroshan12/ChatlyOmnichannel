using Chatly.OmniChannel.Gmail.GServices;
using Microsoft.AspNetCore.Mvc;

namespace Chatly.OmniChannel.Api.Controllers
{


    [ApiController]
    [Route("api/ginbox")]
    public class GmailInboxController : ControllerBase
    {
        private readonly GmailInboxService.GmailInboxServiceClient _grpcClient;

        public GmailInboxController(GmailInboxService.GmailInboxServiceClient grpcClient)
        {
            _grpcClient = grpcClient;
        }

        [HttpGet("inbox")]
        public async Task<IActionResult> GetInbox([FromQuery] string userId, [FromQuery] int maxResults = 10)
        {
            if (!Guid.TryParse(userId, out _))
            {
                return BadRequest("Invalid UserId format.");
            }

            var request = new GetInboxRequest
            {
                UserId = userId,
                MaxResults = maxResults
            };

            try
            {
                var response = await _grpcClient.GetInboxAsync(request);

                // Return the raw Gmail JSON directly
                return Content(response.RawJson, "application/json");
            }
            catch (Grpc.Core.RpcException ex)
            {
                return StatusCode(500, $"gRPC call failed: {ex.Status.Detail}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Unexpected error: {ex.Message}");
            }
        }


        [HttpGet("inboxDetailHtml")]
        public async Task<IActionResult> GetInboxDetailHtml([FromQuery] string userId, [FromQuery] string threadId)
        {
            if (!Guid.TryParse(userId, out _))
            {
                return BadRequest("Invalid UserId format.");
            }

            var request = new GetThreadRequest
            {
                UserId = userId,
                ThreadId = threadId
            };

            try
            {
                var response = await _grpcClient.GetThreadMessagesAsync(request);

                // Return the raw Gmail JSON directly
                return Content(response.HtmlContent, "text/html");
            }
            catch (Grpc.Core.RpcException ex)
            {
                return StatusCode(500, $"gRPC call failed: {ex.Status.Detail}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Unexpected error: {ex.Message}");
            }
        }


        [HttpGet("inboxDetailJson")]
        public async Task<IActionResult> GetInboxDetailJson([FromQuery] string userId, [FromQuery] string threadId)
        {
            if (!Guid.TryParse(userId, out _))
            {
                return BadRequest("Invalid UserId format.");
            }

            var request = new GetThreadRequest
            {
                UserId = userId,
                ThreadId = threadId
            };

            try
            {
                var response = await _grpcClient.GetThreadMessagesAsync(request);

                // Return the raw Gmail JSON directly
                return Content(response.RawJson, "application/json");
            }
            catch (Grpc.Core.RpcException ex)
            {
                return StatusCode(500, $"gRPC call failed: {ex.Status.Detail}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Unexpected error: {ex.Message}");
            }
        }
    }

}
