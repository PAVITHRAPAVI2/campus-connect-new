using Microsoft.AspNetCore.SignalR;
namespace campus_connect.Server.Model
{
         public class ChatHub : Hub
        {
            public async Task JoinGroup(Guid groupId)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, groupId.ToString());
            }

            public async Task LeaveGroup(Guid groupId)
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupId.ToString());
            }
        }
    }
