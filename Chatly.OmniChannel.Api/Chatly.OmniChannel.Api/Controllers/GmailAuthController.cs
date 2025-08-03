
using Chatly.OmniChannel.Gmail.GServices;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Chatly.OmniChannel.Api.Controllers
{
    [ApiController]
    [Route("api/google")]
    public class GmailAuthController : ControllerBase
    {
        private readonly GmailAccountSessionRpc.GmailAccountSessionRpcClient _gmailAccountSessionRpcClient;

        public GmailAuthController(IConfiguration config, GmailAccountSessionRpc.GmailAccountSessionRpcClient gmailAccountSessionRpcClient)
        {
            _gmailAccountSessionRpcClient= gmailAccountSessionRpcClient;
        }

        // Step 1: Generate Google login URL
        [HttpGet("connect")]
        public async Task<IActionResult>  GetGoogleLoginUrl()
        {
            var authUrl =  await _gmailAccountSessionRpcClient.GetGoogleLoginUrlAsync(new Empty());
            return Ok(authUrl);
        }

        // Step 2: Handle redirect with code, return token + user info
        [HttpGet("callback")]
        public async Task<IActionResult> GoogleCallback([FromQuery] string code)
        {
            var result = await _gmailAccountSessionRpcClient.HandleGoogleCallbackAsync(new GoogleCallbackRequest { Code = code });
            return Ok(result);
        }

        [HttpGet("session")]
        public async Task<IActionResult> GetAllSessions()
        {
            var result = await _gmailAccountSessionRpcClient.GetAllSessionsAsync(new Empty());
            return Ok(result);
        }
    }
}
