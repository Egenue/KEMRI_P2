using KemriApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace KemriApi.Data
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;
        internal object screeningforms;

        public MongoDbContext(IConfiguration configuration)
        {
            var mongoUser = configuration["MONGO_USER"];
            var rawPassword = configuration["MONGO_PASSWORD"]; 
            var mongoCluster = configuration["MONGO_CLUSTER"];
            var mongoDb = configuration["MONGO_DB"];

            var mongoPassword = System.Net.WebUtility.UrlEncode(rawPassword);

            // Updated connection string to be more standard for Atlas (authSource=admin)
            var connectionString = $"mongodb+srv://{mongoUser}:{mongoPassword}@{mongoCluster}/?authSource=admin&retryWrites=true&w=majority";
            
            var client = new MongoClient(connectionString);
            _database = client.GetDatabase(mongoDb);
        }

        public IMongoCollection<Login> Logins => _database.GetCollection<Login>("Logins");
        public IMongoCollection<AuditLog> AuditLogs => _database.GetCollection<AuditLog>("AuditLogs");
        public IMongoCollection<AncVisit> AncVisits => _database.GetCollection<AncVisit>("AncVisits");
        public IMongoCollection<CloseoutForm> CloseoutForms => _database.GetCollection<CloseoutForm>("CloseoutForms");
        public IMongoCollection<DeliveryForm> DeliveryForms => _database.GetCollection<DeliveryForm>("DeliveryForms");
        public IMongoCollection<EnrollmentForm> EnrollmentForms => _database.GetCollection<EnrollmentForm>("EnrollmentForms");
        public IMongoCollection<GestationAge> GestationAges => _database.GetCollection<GestationAge>("GestationAges");
        public IMongoCollection<ScreeningForm> ScreeningForms => _database.GetCollection<ScreeningForm>("ScreeningForms");
    }
}
