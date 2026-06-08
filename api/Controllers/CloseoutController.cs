using KemriApi.Services;
using KemriApi.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace KemriApi.Controllers
{
    [ApiController]
    [Route("api")]
    public class CloseoutController : ControllerBase
    {
        private readonly ICloseoutService _closeoutService;

        public CloseoutController(ICloseoutService closeoutService)
        {
            _closeoutService = closeoutService;
        }

        [HttpPost("createCloseout")]
        public async Task<IActionResult> CreateCloseout([FromBody] CloseoutRequest request)
        {
            if (string.IsNullOrEmpty(request.ScreeningId) || request.CloseOutInterviewDate == default)
            {
                return BadRequest(new { message = "Please fill in all required fields" });
            }

            var result = await _closeoutService.CreateCloseoutAsync(request);
            if (result == null)
            {
                return Conflict(new { message = "Closeout record already exists for this Screening ID" });
            }
            return Ok(new { message = "Closeout data saved successfully", data = result });
        }

        [HttpGet("getCloseout")]
        public async Task<IActionResult> GetAllCloseouts()
        {
            var result = await _closeoutService.GetAllCloseoutsAsync();
            return Ok(new { data = result });
        }

        [HttpGet("getOneCloseout/{id}")]
        public async Task<IActionResult> GetOneCloseout(string id)
        {
            var result = await _closeoutService.GetCloseoutByScreeningIdAsync(id);
            if (result == null)
            {
                return NotFound(new { message = "Closeout form not found" });
            }
            return Ok(new { data = result });
        }

        [HttpPut("updateCloseout/{id}")]
        public async Task<IActionResult> UpdateCloseout(string id, [FromBody] CloseoutRequest request)
        {
            var result = await _closeoutService.UpdateCloseoutAsync(id, request);
            if (result == null)
            {
                return NotFound(new { message = "Closeout form not found" });
            }
            return Ok(new { message = "Updated successfully", data = result });
        }

        [HttpDelete("deleteCloseout/{id}")]
        public async Task<IActionResult> DeleteCloseout(string id, [FromBody] DeleteRequest request)
        {
            var success = await _closeoutService.DeleteCloseoutAsync(id, request.UserInitials ?? "SYSTEM", request.Reason ?? "Record deletion");
            if (!success)
            {
                return NotFound(new { message = "Closeout form not found" });
            }
            return Ok(new { success = true, message = "Deleted successfully" });
        }
    }
}
