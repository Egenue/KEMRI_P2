using KemriApi.Data;
using KemriApi.Models;
using KemriApi.ViewModels;
using MongoDB.Driver;

namespace KemriApi.Services
{
    public interface IScreeningService
    {
        Task<ScreeningForm?> CreateScreeningAsync(ScreeningRequest request);
        Task<List<ScreeningForm>> GetAllScreeningsAsync();
        Task<ScreeningForm?> GetScreeningByIdAsync(string screeningId);
        Task<ScreeningForm?> UpdateScreeningAsync(string screeningId, ScreeningRequest request);
        Task<bool> DeleteScreeningAsync(string screeningId, string userInitials, string reason);
    }

    public class ScreeningService : IScreeningService
    {
        private readonly MongoDbContext _context;
        private readonly IAuditService _auditService;

        // Centralized reference targeting lowercase collection mapping naming styles
        private IMongoCollection<ScreeningForm> ScreeningCollection => _context.screeningForms;

        public ScreeningService(MongoDbContext context, IAuditService auditService)
        {
            _context = context;
            _auditService = auditService;
        }

        public async Task<ScreeningForm?> CreateScreeningAsync(ScreeningRequest request)
        {
            // 1. Check for existing record via standard property mapping references
            var exists = await ScreeningCollection.Find(f => f.screeningId == request.screeningId).FirstOrDefaultAsync();
            if (exists != null) return null;

            // 2. Hydrate database entity structure
            var screeningForm = new ScreeningForm
            {
                screeningId = request.screeningId,
                userInitials = request.userInitials,
                healthFacility = request.healthFacility,
                interviewDate = request.interviewDate,
                DoB = request.DoB,
                Age = request.Age,
                height = request.height,
                weight = request.weight,
                BMI = request.BMI,
                vitalSigns = request.vitalSigns,
                lastMenstrualPeriod = request.lastMenstrualPeriod,
                fundalHeight = request.fundalHeight,
                inclusionCriteria = request.inclusionCriteria,
                exclusionCriteria = request.exclusionCriteria,
                eligibility = request.eligibility,
                createdAt = DateTime.UtcNow,
                updatedAt = DateTime.UtcNow
            };

            // 3. Save to MongoDB using centralized tracking references
            await ScreeningCollection.InsertOneAsync(screeningForm);

            // 4. Pass information details over to operational audit logs
            await _auditService.LogAuditAsync(
                action: "CREATE", 
                module: "Screening", 
                recordId: screeningForm.screeningId, 
                userInitials: request.UserInitials,
                reason: "Initial intake screening form submission",
                oldValue: null, 
                newValue: request
            );

            return screeningForm;
        }

        public async Task<List<ScreeningForm>> GetAllScreeningsAsync()
        {
            return await ScreeningCollection.Find(_ => true).ToListAsync();
        }

        public async Task<ScreeningForm?> GetScreeningByIdAsync(string screeningId)
        {
            return await ScreeningCollection.Find(f => f.screeningId == screeningId).FirstOrDefaultAsync();
        }

        public async Task<ScreeningForm?> UpdateScreeningAsync(string screeningId, ScreeningRequest request)
        {
            var oldValue = await GetScreeningByIdAsync(screeningId);
            if (oldValue == null) return null;

            // FIX: Map ViewModel properties over onto the existing core database document tracking model shell
            var updatedForm = new ScreeningForm
            {
                Id = oldValue.Id, // Protect and pass original internal document ID token reference keys
                screeningId = screeningId,
                userInitials = request.userInitials ?? oldValue.userInitials,
                healthFacility = request.healthFacility,
                interviewDate = request.interviewDate,
                DoB = request.DoB,
                Age = request.Age,
                height = request.height,
                weight = request.weight,
                BMI = request.BMI,
                vitalSigns = request.vitalSigns,
                lastMenstrualPeriod = request.lastMenstrualPeriod,
                fundalHeight = request.fundalHeight,
                inclusionCriteria = request.inclusionCriteria,
                exclusionCriteria = request.exclusionCriteria,
                eligibility = request.eligibility,
                createdAt = oldValue.CreatedAt, // Lock original data entry timestamps
                updatedAt = DateTime.UtcNow
            };

            // Replace document with compliant structural entity matching target definitions
            await ScreeningCollection.ReplaceOneAsync(f => f.screeningId == screeningId, updatedForm);

            await _auditService.LogAuditAsync(
                action: "UPDATE", 
                module: "Screening Form", 
                recordId: screeningId, 
                userInitials: request.UserInitials ?? "SYSTEM", 
                reason: request.Reason ?? "Clinical tracking data correction update modification", 
                oldValue: oldValue, 
                newValue: request
            );

            return updatedForm;
        }

        public async Task<bool> DeleteScreeningAsync(string screeningId, string userInitials, string reason)
        {
            var oldValue = await GetScreeningByIdAsync(screeningId);
            if (oldValue == null) return false;

            var result = await ScreeningCollection.DeleteOneAsync(f => f.screeningId == screeningId);
            if (result.DeletedCount > 0)
            {
                await _auditService.LogAuditAsync("DELETE", "Screening Form", screeningId, userInitials, reason, oldValue, null);

                // Cascade delete operations executing against explicit lowercase context references
                await _context.enrollmentForm.DeleteManyAsync(f => f.screeningId == screeningId);
                await _context.deliveryForm.DeleteManyAsync(f => f.deliveryScreeningId == screeningId);
                await _context.closeoutForm.DeleteManyAsync(f => f.screeningId == screeningId);
                await _context.gestationAge.DeleteManyAsync(f => f.screeningId == screeningId);

                return true;
            }
            return false;
        }
    }
}