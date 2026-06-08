using KemriApi.Services;
using KemriApi.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace KemriApi.Controllers
{
    [ApiController]
    [Route("api")]
    public class GestationAgeController : ControllerBase
    {
        private readonly IGestationAgeService _gestAgeService;

        public GestationAgeController(IGestationAgeService gestAgeService)
        {
            _gestAgeService = gestAgeService;
        }

        [HttpPost("createGestAge")]
        public async Task<IActionResult> CreateGestAge([FromBody] GestationAgeRequest request)
        {
            var result = await _gestAgeService.CreateGestAgeAsync(request);
            if (result == null)
            {
                return Conflict(new { message = "This already exists!!!" });
            }
            return Ok(new { message = "Success!!!" });
        }

        [HttpGet("getGestAge")]
        public async Task<IActionResult> GetAllGestAge()
        {
            var result = await _gestAgeService.GetAllGestAgesAsync();
            return Ok(new { message = "Success!!", data = result });
        }

        [HttpGet("getOneGestAge/{screeningId}")]
        public async Task<IActionResult> GetOneGestAge(string screeningId)
        {
            var result = await _gestAgeService.GetGestAgeByScreeningIdAsync(screeningId);
            if (result == null)
            {
                return NotFound(new { message = "Not Found" });
            }
            return Ok(new { message = "Success", data = result });
        }

        [HttpPut("updateGestAge/{screeningId}")]
        public async Task<IActionResult> UpdateGestAge(string screeningId, [FromBody] GestationAgeRequest request)
        {
            var result = await _gestAgeService.UpdateGestAgeAsync(screeningId, request);
            if (result == null)
            {
                return NotFound(new { message = "Record not found" });
            }
            return Ok(new { message = "Update Success!!!", data = result });
        }

        [HttpDelete("deleteGestAge/{screeningId}")]
        public async Task<IActionResult> DeleteGestAge(string screeningId, [FromBody] DeleteRequest request)
        {
            var success = await _gestAgeService.DeleteGestAgeAsync(screeningId, request.UserInitials ?? "SYSTEM", request.Reason ?? "Record deletion");
            if (!success)
            {
                return NotFound(new { message = "Does Not exist" });
            }
            return Ok(new { message = "Success!!!" });
        }
    }
}
