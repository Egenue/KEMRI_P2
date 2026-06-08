using KemriApi.Services;
using KemriApi.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace KemriApi.Controllers
{
    [ApiController]
    [Route("api")]
    public class AncVisitController : ControllerBase
    {
        private readonly IAncVisitService _ancVisitService;

        public AncVisitController(IAncVisitService ancVisitService)
        {
            _ancVisitService = ancVisitService;
        }

        [HttpPost("createAncVisit")]
        public async Task<IActionResult> CreateAncVisit([FromBody] AncVisitRequest request)
        {
            if (string.IsNullOrEmpty(request.VisitNumber))
            {
                return BadRequest(new { message = "Please fill in all the required fields" });
            }

            var result = await _ancVisitService.CreateAncVisitAsync(request);
            return StatusCode(201, new { message = "ANC Visit Form created successfully", ancVisit = result });
        }

        [HttpGet("getAncVisit")]
        public async Task<IActionResult> GetAllAnc()
        {
            var result = await _ancVisitService.GetAllAncVisitsAsync();
            return Ok(new { message = "ANC Forms Found !!!", data = result });
        }

        [HttpGet("getOneAnc/{visitNumber}")]
        public async Task<IActionResult> GetOneAnc(string visitNumber)
        {
            var result = await _ancVisitService.GetAncVisitByNumberAsync(visitNumber);
            if (result == null)
            {
                return NotFound(new { message = "ANC Visit Form not found" });
            }
            return Ok(new { message = "ANC Visit Form Found !!!", data = result });
        }

        [HttpDelete("deleteAnc/{visitNumber}")]
        public async Task<IActionResult> DeleteAnc(string visitNumber, [FromBody] DeleteRequest request)
        {
            var success = await _ancVisitService.DeleteAncVisitAsync(visitNumber, request.UserInitials ?? "SYSTEM", request.Reason ?? "Record deletion");
            if (!success)
            {
                return NotFound(new { message = "ANC Form Not Found !!!" });
            }
            return Ok(new { message = "ANC Form Successfully Deleted " });
        }
    }
}
