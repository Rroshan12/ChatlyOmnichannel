using Chatly.OmniChannel.Gmail.GServices.Interface;
using Chatly.OmniChannel.Gmail.GServices.Model;
using Microsoft.EntityFrameworkCore.Storage;

namespace Chatly.OmniChannel.Gmail.GServices.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        public GmailServiceContext _context;
        private bool _disposed = false;

        public UnitOfWork(GmailServiceContext context)
        {
            _context = context;
        }


        public IDbContextTransaction _transaction { get; set; }

        public IGmailAccountSessionRepository _gmailAccountSessionRepository;


        public IGmailAccountSessionRepository GmailAccountSessionRepository
        {
            get
            {
                if (_gmailAccountSessionRepository == null)
                {
                    _gmailAccountSessionRepository = new GmailAccountSessionRepository(_context);
                }
                return _gmailAccountSessionRepository;
            }
        }

        public async Task BeginTransactionAsync()
        {
            _transaction ??= await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            await _context.Database.CommitTransactionAsync();
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            _disposed = true;
        }

        public void Dispose()
        {
            Dispose(true); GC.SuppressFinalize(this);
        }

        public async Task RollbackTransactionAsync()
        {
            await _context.Database.RollbackTransactionAsync();
        }

        public async Task<int> SaveAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
