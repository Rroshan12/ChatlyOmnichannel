using Chatly.OmniChannel.Gmail.GServices.Model;
using Chatly.OmniChannel.Gmail.GServices.ServiceCollection;
using Chatly.OmniChannel.Gmail.GServices.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContextFactory<GmailServiceContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
// Add services to the container.
builder.Services.AddGrpc();
builder.Services.AddServiceDI();

var app = builder.Build();

// Configure the HTTP request pipeline.   

app.MapGrpcService<GmailAccountSessionRpcService>();
app.MapGrpcService<GmailInboxRpcService>();
app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");

app.Run();
