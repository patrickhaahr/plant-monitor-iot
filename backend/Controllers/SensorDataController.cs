using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SensorDataController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SensorDataController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/SensorData
        [HttpPost]
        public async Task<IActionResult> PostSensorData([FromBody] SensorData sensorData)
        {
            if (sensorData is null)
            {
                return BadRequest("Sensor data is null.");
            }

            sensorData.Timestamp = DateTime.UtcNow;

            _context.SensorData.Add(sensorData);
            await _context.SaveChangesAsync();

            return Ok(sensorData);
        }

        // GET: api/SensorData
        [HttpGet]
        public async Task<IActionResult> GetSensorData()
        {
            if (_context.SensorData is null)
            {
                return NotFound();
            }

            var sensorData = await _context.SensorData.ToListAsync();
            return Ok(sensorData);
        }
        
    }
}