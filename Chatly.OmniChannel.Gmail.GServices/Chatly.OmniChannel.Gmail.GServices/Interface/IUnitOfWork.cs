namespace Chatly.OmniChannel.Gmail.GServices.Interface
{
    public interface IUnitOfWork
    {
        public IGmailAccountSessionRepository GmailAccountSessionRepository { get; }
        //public IPropertyImageRepository PropertyImageRepository { get; }
        public Task BeginTransactionAsync();

        public Task CommitTransactionAsync();
        public Task RollbackTransactionAsync();


        public Task<int> SaveAsync();

        public void Dispose();

    }
}
