using Microsoft.EntityFrameworkCore;

namespace Chatly.OmniChannel.Gmail.GServices.Model
{
    public class GmailServiceContext : DbContext
    {
        public GmailServiceContext(DbContextOptions<GmailServiceContext> options) : base(options) { }

        public DbSet<GmailAccountSession> GmailAccountSession { get; set; }
    }
}
