using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

using Newtonsoft.Json;

using MySharpView.Service;

namespace MySharpView.Controllers
{
    [Route("api/[controller]")]
    public class DatabaseController : Controller
    {
        public const string SESSION_KEYT_INSTANCE = "instance";

        [HttpGet("[action]")]
        public InstanceConnection Info()
        {
            var instance = HttpContext.Session.GetString(SESSION_KEYT_INSTANCE);
            if (instance == null)
            {
                return null;
            }
            return JsonConvert.DeserializeObject<InstanceConnection>(instance);
        }

        [HttpPost("[action]")]
        public OpenResult Connect([FromBody] Connection connection)
        {
            OpenResult result = new OpenResult();
            try
            {
                var instance = connection.Open();
                HttpContext.Session.SetString(SESSION_KEYT_INSTANCE, JsonConvert.SerializeObject(instance));
                result.Success = true;
                result.Connection = instance;
            }
            catch (System.Exception e)
            {
                result.Success = false;
                result.Message = e.Message;
            }
            return result;
        }
    }

    public class OpenResult
    {
        public InstanceConnection Connection;
        public bool Success;
        public string Message;
    }
}
