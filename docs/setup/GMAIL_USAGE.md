# Using Email & Calendar in OpenClaw

All sessions (main, subagents, group chats) can now use Gmail and Calendar through the helper module.

## Quick Start

### Send an Email

```python
from gmail_helper import GmailHelper

gmail = GmailHelper()
result = gmail.send_email(
    to_addr='probinson85@live.com.au',
    subject='Research Summary',
    body='Here are the findings...'
)
print(result)  # ✅ or ❌ status
```

### Get Calendar Events

```python
from gmail_helper import CalendarHelper

cal = CalendarHelper()

# Get next 7 days from chris.cole calendar
events = cal.get_events('chris.cole.work1985@gmail.com', days=7)

# Get next 7 days from pjrobinson85 calendar (read-only)
events = cal.get_events('pjrobinson85@gmail.com', days=7)

# Print events
for event in events:
    print(f"📌 {event['summary']}")
    print(f"   {event['start'].get('dateTime', event['start'].get('date'))}")
```

### Create an Event (Write Access)

```python
from gmail_helper import CalendarHelper
from datetime import datetime, timedelta

cal = CalendarHelper()

# Create event tomorrow at 2pm for 1 hour
start = datetime.now() + timedelta(days=1)
start = start.replace(hour=14, minute=0, second=0, microsecond=0)

result = cal.create_event(
    summary='Team Meeting',
    start_time=start,
    duration_hours=1,
    description='Q1 planning session'
)
print(result)  # ✅ or ❌ status
```

### Update an Event

```python
from gmail_helper import CalendarHelper

cal = CalendarHelper()

# Update event (you need the event ID)
result = cal.update_event(
    event_id='YOUR_EVENT_ID',
    updates={
        'summary': 'Updated Meeting Title',
        'description': 'New description'
    }
)
print(result)
```

### Delete an Event

```python
from gmail_helper import CalendarHelper

cal = CalendarHelper()

result = cal.delete_event(event_id='YOUR_EVENT_ID')
print(result)  # ✅ or ❌ status
```

## Permissions

### Email
✅ **Can send to:**
- probinson85@live.com.au
- paulrobinson85@outlook.com.au

❌ **Cannot send to:** Any other address

**Rate Limits:**
- 5 emails per hour
- 20 emails per day
- All sends logged to `/root/.openclaw/logs/email-audit.log`

### Calendar
✅ **chris.cole.work1985@gmail.com:**
- ✅ Read events
- ✅ Create events
- ✅ Update events
- ✅ Delete events

✅ **pjrobinson85@gmail.com:**
- ✅ Read events only
- ❌ Cannot write/create/update/delete

## Usage in Different Contexts

### In Main Session
```python
from gmail_helper import GmailHelper, CalendarHelper
# Use directly as shown above
```

### In Subagents
```python
import sys
sys.path.insert(0, '/root/.openclaw/workspace')
from gmail_helper import GmailHelper, CalendarHelper
# Then use as normal
```

### In Group Chat Sessions
```python
import sys
sys.path.insert(0, '/root/.openclaw/workspace')
from gmail_helper import GmailHelper, CalendarHelper
# Available in any chat thread
```

## Common Tasks

### Send Research Summary
```python
from gmail_helper import GmailHelper
gmail = GmailHelper()
gmail.send_email(
    'probinson85@live.com.au',
    'Research Results: Web Search on Topic X',
    f"""Found 5 results:
    
1. Result A
2. Result B
3. Result C

Full details above."""
)
```

### Check Schedule Before Scheduling
```python
from gmail_helper import CalendarHelper
from datetime import datetime, timedelta

cal = CalendarHelper()
events = cal.get_events('chris.cole.work1985@gmail.com', days=7)

# Check if tomorrow is free
tomorrow = (datetime.now() + timedelta(days=1)).date()
tomorrow_events = [e for e in events if tomorrow.isoformat() in e['start'].get('dateTime', '')]

if not tomorrow_events:
    print("Tomorrow is free!")
else:
    for event in tomorrow_events:
        print(f"Busy: {event['summary']}")
```

### Schedule a Task (Auto-Create Calendar Event)
```python
from gmail_helper import CalendarHelper
from datetime import datetime, timedelta

cal = CalendarHelper()

# Schedule "Work on Report Writer" for tomorrow 10am for 2 hours
start = datetime.now() + timedelta(days=1)
start = start.replace(hour=10, minute=0, second=0, microsecond=0)

result = cal.create_event(
    summary='Work on Report Writer',
    start_time=start,
    duration_hours=2,
    description='Development + testing'
)
print(result)
```

### Send Daily Summary Email with Calendar
```python
from gmail_helper import GmailHelper, CalendarHelper
from datetime import datetime

gmail = GmailHelper()
cal = CalendarHelper()

events = cal.get_events('chris.cole.work1985@gmail.com', days=1)

summary = f"Daily Summary - {datetime.now().strftime('%Y-%m-%d')}\n\n"
summary += "📅 Today's Schedule:\n"
if events:
    for event in events:
        start = event['start'].get('dateTime', event['start'].get('date'))
        summary += f"  - {event['summary']} @ {start}\n"
else:
    summary += "  (No events)\n"

gmail.send_email('probinson85@live.com.au', 'Daily Rundown', summary)
```

## Error Handling

```python
from gmail_helper import GmailHelper

gmail = GmailHelper()
result = gmail.send_email(to_addr, subject, body)

if result.startswith('✅'):
    # Success
    pass
else:
    # Failed - result contains error message
    print(f"Error: {result}")
```

## Troubleshooting

**"❌ Address not in whitelist"**
- Only probinson85@live.com.au and paulrobinson85@outlook.com.au are allowed
- Contact Paul to add more addresses

**"❌ Token not found"**
- Credentials haven't been authorized yet
- Run the OAuth setup for that calendar/email

**"❌ Error sending email"**
- Check rate limits (5/hour, 20/day)
- Check email quota
- Check internet connection

**"❌ Can only write to chris.cole.work1985@gmail.com calendar"**
- Only chris.cole calendar has write access
- pjrobinson85@gmail.com is read-only

## Token Files

Located at `/root/.openclaw/credentials/`:
- `google-credentials.json` — OAuth2 app credentials (read-only)
- `google-token.json` — Gmail auth token (auto-refreshes)
- `google-calendar-token.json` — chris.cole.work1985@gmail.com calendar (read+write)
- `google-pj-calendar-token.json` — pjrobinson85@gmail.com calendar (read-only)

Tokens auto-refresh when expired. No manual intervention needed.
