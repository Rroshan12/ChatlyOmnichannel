using Chatly.OmniChannel.Gmail.GServices.Model.Enum;
using System.ComponentModel.DataAnnotations;


namespace Chatly.OmniChannel.Gmail.GServices.Model
{
    public class GmailAccountSession
    {
        [Key]
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public DateTime IssuedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public string TokenType { get; set; }
        public string Scope { get; set; }
        public bool IsActive { get; set; }

        public bool IsDelated { get; set; }
        public ConnectionStatus Status { get; set; }
    }
}
