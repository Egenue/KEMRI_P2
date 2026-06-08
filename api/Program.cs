using KemriApi.Data;
using KemriApi.Services;
using Scalar.AspNetCore;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using KemriApi.ViewModels;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// 1. Native .NET 10 OpenAPI document generation (Replaces AddSwaggerGen)
builder.Services.AddOpenApi();

// Configure MongoDB
builder.Services.AddSingleton<MongoDbContext>();

// Configure Services
builder.Services.AddScoped<IAuditService, AuditService>();
builder.Services.AddScoped<ILoginService, LoginService>();
builder.Services.AddScoped<IScreeningService, ScreeningService>();
builder.Services.AddScoped<IAncVisitService, AncVisitService>();
builder.Services.AddScoped<ICloseoutService, CloseoutService>();
builder.Services.AddScoped<IDeliveryService, DeliveryService>();
builder.Services.AddScoped<IEnrollmentService, EnrollmentService>();
builder.Services.AddScoped<IGestationAgeService, GestationAgeService>();

// Whitelist specific mapping models for loose Object serialization
Func<Type, bool> allowedTypes = x => x == typeof(ScreeningRequest) || x.FullName.StartsWith("KemriApi.Models");
BsonSerializer.RegisterSerializer(new ObjectSerializer(allowedTypes));


// Configure CORS
var allowedOrigins = builder.Configuration.GetSection("CORS_ORIGIN").Get<string>()?.Split(',') 
    ?? new[] { "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "https://kemri-p2.vercel.app" };


builder.Services.AddCors(options =>
{
    options.AddPolicy("DefaultPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.MapScalarApiReference(); 
}

app.UseCors("DefaultPolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();