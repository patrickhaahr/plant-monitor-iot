namespace backend.Models;
using System.ComponentModel.DataAnnotations.Schema;

public class SensorData
{
    public int Id { get; set; }
    public int Moisture { get; set; }
    [Column(TypeName = "datetime2(0)")]
    public DateTime Timestamp { get; set; }
}