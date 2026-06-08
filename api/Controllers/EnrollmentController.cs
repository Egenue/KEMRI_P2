using KemriApi.Services;
using KemriApi.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace KemriApi.Controllers
{
    [ApiController]
    [Route("api")]
    public class EnrollmentController : ControllerBase
    {
        private readonly IEnrollmentService _enrollmentService;

        public EnrollmentController(IEnrollmentService enrollmentService)
        {
            _enrollmentService = enrollmentService;
        }

        [HttpPost("createEnrollment")]
        public async Task<IActionResult> CreateEnrollment([FromBody] EnrollmentRequest request)
        {
            var result = await _enrollmentService.CreateEnrollmentAsync(request);
            if (result == null)
            {
                return BadRequest(new { message = "Could not create enrollment form. It may already exist or Screening ID is invalid." });
            }
            return Ok(new { data = result });
        }

        [HttpGet("getEnrollment")]
        public async Task<IActionResult> GetAllEnrollments()
        {
            var result = await _enrollmentService.GetAllEnrollmentsAsync();
            return Ok(new { data = result });
        }

        [HttpGet("getOneEnrollment/{id}")]
        public async Task<IActionResult> GetOneEnrollment(string id)
        {
            var result = await _enrollmentService.GetEnrollmentByScreeningIdAsync(id);
            if (result == null)
            {
                return NotFound(new { message = "Enrollment form not found" });
            }
            return Ok(new { message = "Enrollment form found", data = result });
        }

        [HttpPut("updateEnrollment/{id}")]
        public async Task<IActionResult> UpdateEnrollment(string id, [FromBody] EnrollmentRequest request)
        {
            var result = await _enrollmentService.UpdateEnrollmentAsync(id, request);
            if (result == null)
            {
                return NotFound(new { message = "Enrollment form not found" });
            }
            return Ok(new { message = "Updated successfully", data = result });
        }

        [HttpDelete("deleteOne/{id}")]
        public async Task<IActionResult> DeleteEnrollment(string id, [FromBody] DeleteRequest request)
        {
            var success = await _enrollmentService.DeleteEnrollmentAsync(id, request.UserInitials ?? "SYSTEM", request.Reason ?? "Record deletion");
            if (!success)
            {
                return NotFound(new { message = "Enrollment form not found" });
            }
            return Ok(new { success = true, message = "Deleted successfully" });
        }
    }
}
