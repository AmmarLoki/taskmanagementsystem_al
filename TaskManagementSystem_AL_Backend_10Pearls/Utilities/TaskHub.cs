using Microsoft.AspNetCore.SignalR;

namespace TaskManagementSystem_AL_Backend_10Pearls.Utilities
{
    public class TaskHub : Hub
    {
        public async Task NotifyUpdate(string message)
        {
            await Clients.All.SendAsync("ReceiveUpdate", message);
        }
    }

}
