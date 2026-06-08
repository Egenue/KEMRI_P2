using KemriApi.Services;
using KemriApi.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace KemriApi.Controllers
{
    [ApiController]
    [Route("api")]
    public class ScreeningController : ControllerBase
    {
        private readonly IScreeningService _screeningService;

        public ScreeningController(IScreeningService screeningService)
        {
            _screeningService = screeningService;
        }

        [HttpPost("createScreeningForm")]
        public async Task<IActionResult> CreateScreening([FromBody] ScreeningRequest request)
        {
            var result = await _screeningService.CreateScreeningAsync(request);
            if (result == null)
            {
                return Conflict(new { message = "This form already exists" });
            }
            return Ok(new { message = "Successful!! Form saved", data = result });
        }

        [HttpGet("getScreeningForms")]
        public async Task<IActionResult> GetAllScreenings()
        {
            var result = await _screeningService.GetAllScreeningsAsync();
            return Ok(new { message = "Screening forms found !!", data = result });
        }

        [HttpGet("getOneScreeningForm/{id}")]
        public async Task<IActionResult> GetOneScreening(string id)
        {
            var result = await _screeningService.GetScreeningByIdAsync(id);
            if (result == null)
            {
                return NotFound(new { message = "The screening form was not found !!" });
            }
            return Ok(new { message = "Screening form found !!", data = result });
        }

        [HttpPut("updateScreeningForm/{id}")]
        public async Task<IActionResult> UpdateScreening(string id, [FromBody] ScreeningRequest request)
        {
            var result = await _screeningService.UpdateScreeningAsync(id, request);
            if (result == null)
            {
                return NotFound(new { message = "Screening form not found !!" });
            }
            return Ok(new { message = "Updated successfully", data = result });
        }

        [HttpDelete("deleteScreeningForm/{id}")]
        public async Task<IActionResult> DeleteScreening(string id, [FromBody] DeleteRequest request)
        {
            var success = await _screeningService.DeleteScreeningAsync(id, request.UserInitials ?? "SYSTEM", request.Reason ?? "Record deletion (Cascaded)");
            if (!success)
            {
                return NotFound(new { message = "Screening form does not exist" });
            }
            return Ok(new { message = "Deleted successfully and cascaded to all modules", success = true });
        }
    }

    public class DeleteRequest
    {
        public string? UserInitials { get; set; }
        public string? Reason { get; set; }
    }
}
