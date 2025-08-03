using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace Chatly.OmniChannel.Gmail.GServices.Interface
{
    public interface IRepository<TEntity> where TEntity : class
    {
        public Task<TEntity> GetById(object id);
        Task<TEntity> GetById(params object[] id);

        //incorrect definition SA
        //Task<TEntity> GetByIdInclude(object id, params string[] includes);
        Task<IEnumerable<TEntity>> SelectWhere(params Expression<Func<TEntity, bool>>[] predictes);
        Task<IEnumerable<TEntity>> SelectWhereInclude(string[] includes, params Expression<Func<TEntity, bool>>[] predictes);
        public Task<IEnumerable<TEntity>> GetAll();
        Task<IEnumerable<TEntity>> GetAllInclude(params string[] includes);
        public IQueryable<TEntity> SelectWhereQuery(params Expression<Func<TEntity, bool>>[] predictes);
        public IQueryable<TEntity> SelectWhereIncludeQuery(string[] includes, params Expression<Func<TEntity, bool>>[] predictes);
        ValueTask<EntityEntry<TEntity>> Insert(TEntity entity);
        void Update(TEntity entityToUpdate);
        void Delete(object id);
        void Delete(TEntity entityToDelete);
        void DeleteRange(List<TEntity> entityToDelete);
        void Detach(TEntity entity);
        Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate);
        Task AddRange(IEnumerable<TEntity> entities);
        void UpdateRange(IEnumerable<TEntity> entities);
        Task<IEnumerable<TEntity>> SelectWhereIncludeWithTracking(string[] includes, params Expression<Func<TEntity, bool>>[] predicates);
        IQueryable<TEntity> Get(Expression<Func<TEntity, bool>> predicate = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null, Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null, bool disableTracking = true);
        IQueryable<TEntity> SelectWhereIncludeQuery(List<Expression<Func<TEntity, bool>>> includes, params Expression<Func<TEntity, bool>>[] predictes);
    }
}
