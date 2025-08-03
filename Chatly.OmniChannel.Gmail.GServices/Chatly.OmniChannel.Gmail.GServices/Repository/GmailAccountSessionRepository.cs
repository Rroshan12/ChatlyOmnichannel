using Chatly.OmniChannel.Gmail.GServices.Interface;
using Chatly.OmniChannel.Gmail.GServices.Model;

namespace Chatly.OmniChannel.Gmail.GServices.Repository
{
    public class GmailAccountSessionRepository : Repository<GmailAccountSession>, IGmailAccountSessionRepository
    {
        public GmailAccountSessionRepository(GmailServiceContext context) : base(context)
        {
        }
    }
}
