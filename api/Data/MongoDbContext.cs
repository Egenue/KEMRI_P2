using KemriApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace KemriApi.Data
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(IConfiguration configuration)
        {
            var mongoUser = configuration["MONGO_USER"];
            // 1. Grab the raw password
            var rawPassword = configuration["MONGO_PASSWORD"]; 
            var mongoCluster = configuration["MONGO_CLUSTER"];
            var mongoDb = configuration["MONGO_DB"];

            // 2. Safely URL encode special characters (e.g. '@' becomes '%40')
            var mongoPassword = System.Net.WebUtility.UrlEncode(rawPassword);

            // 3. Interpolate the safely encoded password
            var connectionString = $"mongodb+srv://{mongoUser}:{mongoPassword}@{mongoCluster}/{mongoDb}?retryWrites=true&w=majority";
            
            var client = new MongoClient(connectionString);
            _database = client.GetDatabase(mongoDb);
        }

        public IMongoCollection<Login> Logins => _database.GetCollection<Login>("Logins");
        public IMongoCollection<AuditLog> AuditLogs => _database.GetCollection<AuditLog>("AuditLogs");
        public IMongoCollection<AncVisit> AncVisits => _database.GetCollection<AncVisit>("ancVisits");
        public IMongoCollection<CloseoutForm> CloseoutForms => _database.GetCollection<CloseoutForm>("closeoutForms");
        public IMongoCollection<DeliveryForm> DeliveryForms => _database.GetCollection<DeliveryForm>("deliveryForms");
        public IMongoCollection<EnrollmentForm> EnrollmentForms => _database.GetCollection<EnrollmentForm>("EnrollmentForms");
        public IMongoCollection<GestationAge> GestationAges => _database.GetCollection<GestationAge>("gestationAges");
        public IMongoCollection<ScreeningForm> ScreeningForms => _database.GetCollection<ScreeningForm>("screeningForms");
    }
}
