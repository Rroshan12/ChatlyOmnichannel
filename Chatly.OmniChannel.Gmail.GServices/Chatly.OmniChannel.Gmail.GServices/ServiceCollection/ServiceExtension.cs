using Chatly.OmniChannel.Gmail.GServices.Interface;
using Chatly.OmniChannel.Gmail.GServices.Repository;

namespace Chatly.OmniChannel.Gmail.GServices.ServiceCollection
{
    public static  class ServiceExtension
    {
        public static IServiceCollection AddServiceDI(this IServiceCollection services)
        {
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            services.AddScoped<IGmailAccountSessionRepository, GmailAccountSessionRepository>();
        
            return services;
        }
    }
}
