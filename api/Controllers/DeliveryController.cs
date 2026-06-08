using KemriApi.Services;
using KemriApi.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace KemriApi.Controllers
{
    [ApiController]
    [Route("api")]
    public class DeliveryController : ControllerBase
    {
        private readonly IDeliveryService _deliveryService;

        public DeliveryController(IDeliveryService deliveryService)
        {
            _deliveryService = deliveryService;
        }

        [HttpPost("createDelivery")]
        public async Task<IActionResult> CreateDelivery([FromBody] DeliveryRequestModel request)
        {
            if (string.IsNullOrEmpty(request.DeliveryScreeningId) || request.InterviewDate == default)
            {
                return BadRequest(new { message = "Please fill in required fields: deliveryScreeningId and interviewDate" });
            }

            var result = await _deliveryService.CreateDeliveryAsync(request);
            if (result == null)
            {
                return Conflict(new { message = "Form already exists !!" });
            }
            return Ok(new { message = "Data saved successfully", data = result });
        }

        [HttpGet("getDelivery")]
        public async Task<IActionResult> GetDeliveries()
        {
            var result = await _deliveryService.GetAllDeliveriesAsync();
            return Ok(new { data = result });
        }

        [HttpGet("getoneDelivery/{id}")]
        public async Task<IActionResult> GetOneDelivery(string id)
        {
            var result = await _deliveryService.GetDeliveryByScreeningIdAsync(id);
            if (result == null)
            {
                return NotFound(new { message = "Form not found !!" });
            }
            return Ok(new { data = result });
        }

        [HttpPut("updateDelivery/{id}")]
        public async Task<IActionResult> UpdateDelivery(string id, [FromBody] DeliveryRequestModel request)
        {
            var result = await _deliveryService.UpdateDeliveryAsync(id, request);
            if (result == null)
            {
                return NotFound(new { message = "Delivery form not found" });
            }
            return Ok(new { message = "Updated successfully", data = result });
        }

        [HttpDelete("deleteDelivery/{id}")]
        public async Task<IActionResult> DeleteDelivery(string id, [FromBody] DeleteRequest request)
        {
            var success = await _deliveryService.DeleteDeliveryAsync(id, request.UserInitials ?? "SYSTEM", request.Reason ?? "Record deletion");
            if (!success)
            {
                return NotFound(new { message = "Form not found" });
            }
            return Ok(new { success = true, message = "Deleted successfully" });
        }
    }
}
