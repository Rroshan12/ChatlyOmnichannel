using Chatly.OmniChannel.Gmail.GServices.Interface;
using Chatly.OmniChannel.Gmail.GServices.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace Chatly.OmniChannel.Gmail.GServices.Repository
{
    public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
    {
        internal GmailServiceContext context;
        internal DbSet<TEntity> dbSet;
        public Repository(GmailServiceContext context)
        {
            this.context = context;
            dbSet = context.Set<TEntity>();
        }

        public IQueryable<TEntity> SelectWhereQuery(params Expression<Func<TEntity, bool>>[] predictes)
        {
            IQueryable<TEntity> query = dbSet;
            foreach (var predicate in predictes)
            {
                query = query.Where(predicate);
            }

            return query;
        }

        public IQueryable<TEntity> SelectWhereIncludeQuery(string[] includes, params Expression<Func<TEntity, bool>>[] predictes)
        {
            IQueryable<TEntity> query = dbSet;
            foreach (var include in includes)
            {
                query = query.Include(include);
            }

            foreach (var predicate in predictes)
            {
                query = query.Where(predicate);
            }
            return query.AsNoTracking();
        }


        public async Task<IEnumerable<TEntity>> SelectWhere(params Expression<Func<TEntity, bool>>[] predictes)
        {
            IQueryable<TEntity> query = dbSet;
            foreach (var predicate in predictes)
            {
                query = dbSet.Where(predicate);
            }

            return await query.ToListAsync();
        }

        public async Task<IEnumerable<TEntity>> SelectWhereInclude(string[] includes, params Expression<Func<TEntity, bool>>[] predicates)
        {
            IQueryable<TEntity> query = dbSet;

            foreach (var include in includes)
            {
                query = query.Include(include);
            }
            if (predicates != null)
                foreach (var predicate in predicates)
                {
                    query = query.Where(predicate);
                }

            return await query.AsNoTracking().ToListAsync();
        }

        public async Task<IEnumerable<TEntity>> SelectWhereIncludeWithTracking(string[] includes, params Expression<Func<TEntity, bool>>[] predicates)
        {
            IQueryable<TEntity> query = dbSet;

            foreach (var include in includes)
            {
                query = query.Include(include);
            }
            if (predicates != null)
                foreach (var predicate in predicates)
                {
                    query = query.Where(predicate);
                }

            return await query.ToListAsync();
        }

        public async Task<IEnumerable<TEntity>> GetAll()
        {
            return await dbSet.ToListAsync();
        }


        public async Task<IEnumerable<TEntity>> GetAllInclude(params string[] includes)
        {
            IQueryable<TEntity> query = dbSet;
            foreach (var include in includes)
            {
                query = query.Include(include);
            }

            return await query.ToListAsync();
        }

        public async Task<TEntity> GetById(object id)
        {
            return await dbSet.FindAsync(id);
        }

        public async Task<TEntity> GetById(params object[] id)
        {
            return await dbSet.FindAsync(id);
        }

        // Incorrect SA
        public async Task<TEntity> GetByIdInclude(object id, params string[] includes)
        {
            IQueryable<TEntity> query = dbSet;
            foreach (var include in includes)
            {
                query = query.Include(include);
            }

            return await query.FirstOrDefaultAsync();
        }

        public virtual async ValueTask<EntityEntry<TEntity>> Insert(TEntity entity)
        {
            return await dbSet.AddAsync(entity);
        }

        public async Task AddRange(IEnumerable<TEntity> entities)
        {
            await dbSet.AddRangeAsync(entities);
        }

        public virtual void Delete(object id)
        {
            TEntity entityToDelete = dbSet.Find(id);
            Delete(entityToDelete);
        }

        public virtual void Delete(TEntity entityToDelete)
        {
            //if (context.Entry(entityToDelete).State == EntityState.Detached)
            //{
            //    dbSet.Attach(entityToDelete);
            //}
            dbSet.Remove(entityToDelete);
        }

        public virtual void Update(TEntity entityToUpdate)
        {
            //dbSet.Attach(entityToUpdate);
            context.Entry(entityToUpdate).State = EntityState.Modified;
        }

        public async Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate)
            => await dbSet.AnyAsync(predicate);

        public void DeleteRange(List<TEntity> entityList)
        {
            foreach (var entity in entityList)
            {
                if (context.Entry(entity).State == EntityState.Detached)
                    dbSet.Attach(entity);
            }
            dbSet.RemoveRange(entityList);
        }

        public void Detach(TEntity entity)
        {
            context.Entry(entity).State = EntityState.Detached;
        }

        public void UpdateRange(IEnumerable<TEntity> entities)
        {
            context.UpdateRange(entities);
        }


        public IQueryable<TEntity> SelectWhereIncludeQuery(List<Expression<Func<TEntity, bool>>> includes, params Expression<Func<TEntity, bool>>[] predictes)
        {
            IQueryable<TEntity> query = dbSet;
            foreach (var include in includes)
            {
                query = query.Include(include);
            }

            foreach (var predicate in predictes)
            {
                query = query.Where(predicate);
            }
            return query.AsNoTracking();
        }

        public IQueryable<TEntity> Get(Expression<Func<TEntity, bool>> predicate = null,
                                          Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                                          Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
                                          bool disableTracking = true)
        {
            IQueryable<TEntity> query = dbSet;
            if (disableTracking)
            {
                query = query.AsNoTracking();
            }

            if (include != null)
            {
                query = include(query);
            }

            if (predicate != null)
            {
                query = query.Where(predicate);
            }

            if (orderBy != null)
            {
                return orderBy(query);
            }
            else
            {
                return query;
            }
        }

    }
}
