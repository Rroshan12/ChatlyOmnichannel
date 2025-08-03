


using Chatly.OmniChannel.Gmail.GServices;
using System.Runtime.Intrinsics.X86;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddGrpcClient<GmailAccountSessionRpc.GmailAccountSessionRpcClient>(options =>
{
    options.Address = new Uri("http://localhost:5112");
});
builder.Services.AddGrpcClient<GmailInboxService.GmailInboxServiceClient>(options =>
{
    options.Address = new Uri("http://localhost:5112");
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigin", policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowOrigin");
app.UseAuthorization();

app.MapControllers();

app.Run();
