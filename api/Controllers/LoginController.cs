using KemriApi.Models;
using KemriApi.Services;
using KemriApi.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace KemriApi.Controllers
{
    [ApiController]
    [Route("api")]
    public class LoginController : ControllerBase
    {
        private readonly ILoginService _loginService;

        public LoginController(ILoginService loginService)
        {
            _loginService = loginService;
        }

        [HttpPost("createLogin")]
        public async Task<IActionResult> CreateLogin([FromBody] RegisterRequest request)
        {
            var user = await _loginService.RegisterAsync(request);
            if (user == null)
            {
                return BadRequest(new { message = "User already exists" });
            }
            return CreatedAtAction(nameof(GetLoginById), new { id = user.Id }, user);
        }

        [HttpPost("userLogin")]
        public async Task<IActionResult> UserLogin([FromBody] LoginRequest request)
        {
            var response = await _loginService.LoginAsync(request);
            if (response == null)
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }
            return Ok(new { message = "Login successful", user = response, dateLoggedIn = response.DateLoggedIn.ToString("D") });
        }

        [HttpGet("allLogin")]
        public async Task<IActionResult> GetAllLogins()
        {
            var logins = await _loginService.GetAllLoginsAsync();
            return Ok(logins);
        }

        [HttpGet("loginId/{id}")]
        public async Task<IActionResult> GetLoginById(string id)
        {
            var login = await _loginService.GetLoginByIdAsync(id);
            if (login == null)
            {
                return NotFound(new { message = "Login not found" });
            }
            return Ok(login);
        }

        [HttpDelete("deleteLogin/{id}")]
        public async Task<IActionResult> DeleteLogin(string id)
        {
            var deleted = await _loginService.DeleteLoginAsync(id);
            if (!deleted)
            {
                return NotFound(new { message = "Login not found" });
            }
            return Ok(new { message = "Login deleted successfully" });
        }
    }
}
