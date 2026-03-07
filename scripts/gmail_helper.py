"""
Gmail & Calendar Helper for OpenClaw
Any session/agent can import this to send emails and manage calendars
"""

import json
from pathlib import Path
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import base64
from email.mime.text import MIMEText
from datetime import datetime, timedelta

class GmailHelper:
    def __init__(self):
        self.creds_dir = Path.home() / '.openclaw' / 'credentials'
        self.gmail_account = 'chris.cole.work1985@gmail.com'
        self.whitelist = [
            'probinson85@live.com.au',
            'paulrobinson85@outlook.com.au'
        ]
    
    def _load_creds(self):
        """Load Google credentials"""
        creds_file = self.creds_dir / 'google-credentials.json'
        token_file = self.creds_dir / 'google-token.json'
        
        with open(creds_file, 'r') as f:
            creds_config = json.load(f)['installed']
        
        with open(token_file, 'r') as f:
            token_data = json.load(f)
        
        token_data['client_id'] = creds_config['client_id']
        token_data['client_secret'] = creds_config['client_secret']
        
        return Credentials.from_authorized_user_info(token_data)
    
    def send_email(self, to_addr, subject, body):
        """Send email to whitelisted address"""
        if to_addr not in self.whitelist:
            return f"❌ Address {to_addr} not in whitelist"
        
        try:
            creds = self._load_creds()
            service = build('gmail', 'v1', credentials=creds)
            
            message = MIMEText(body)
            message['to'] = to_addr
            message['from'] = self.gmail_account
            message['subject'] = subject
            
            raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
            send_message = {'raw': raw_message}
            
            result = service.users().messages().send(userId='me', body=send_message).execute()
            return f"✅ Email sent to {to_addr} (ID: {result['id']})"
        except Exception as e:
            return f"❌ Error sending email: {str(e)}"
    
    def get_unread_emails(self, limit=10):
        """Get unread emails from inbox"""
        try:
            creds = self._load_creds()
            service = build('gmail', 'v1', credentials=creds)
            
            # Get unread message IDs
            results = service.users().messages().list(
                userId='me',
                q='is:unread',
                maxResults=limit
            ).execute()
            
            messages = results.get('messages', [])
            if not messages:
                return []
            
            # Get full message details for each
            emails = []
            for msg in messages:
                try:
                    full_msg = service.users().messages().get(
                        userId='me',
                        id=msg['id'],
                        format='full'
                    ).execute()
                    
                    headers = full_msg['payload'].get('headers', [])
                    header_dict = {h['name']: h['value'] for h in headers}
                    
                    # Get body
                    body_text = ''
                    if 'parts' in full_msg['payload']:
                        for part in full_msg['payload']['parts']:
                            if part['mimeType'] == 'text/plain':
                                data = part['body'].get('data', '')
                                if data:
                                    body_text = base64.urlsafe_b64decode(data).decode('utf-8')
                                    break
                    else:
                        data = full_msg['payload']['body'].get('data', '')
                        if data:
                            body_text = base64.urlsafe_b64decode(data).decode('utf-8')
                    
                    emails.append({
                        'id': msg['id'],
                        'from': header_dict.get('From', 'Unknown'),
                        'subject': header_dict.get('Subject', '(No Subject)'),
                        'date': header_dict.get('Date', 'Unknown'),
                        'snippet': full_msg.get('snippet', '')[:200],
                        'body': body_text[:500]  # First 500 chars
                    })
                except Exception as e:
                    print(f"Warning: Could not parse message {msg['id']}: {str(e)}")
            
            return emails
        except Exception as e:
            return f"❌ Error fetching emails: {str(e)}"
    
    def get_email_count(self):
        """Get count of unread emails"""
        try:
            creds = self._load_creds()
            service = build('gmail', 'v1', credentials=creds)
            
            results = service.users().messages().list(
                userId='me',
                q='is:unread'
            ).execute()
            
            return results.get('resultSizeEstimate', 0)
        except Exception as e:
            return f"❌ Error counting emails: {str(e)}"

class CalendarHelper:
    def __init__(self):
        self.creds_dir = Path.home() / '.openclaw' / 'credentials'
    
    def _load_creds(self, token_file):
        """Load Google credentials"""
        creds_file = self.creds_dir / 'google-credentials.json'
        
        with open(creds_file, 'r') as f:
            creds_config = json.load(f)['installed']
        
        with open(token_file, 'r') as f:
            token_data = json.load(f)
        
        token_data['client_id'] = creds_config['client_id']
        token_data['client_secret'] = creds_config['client_secret']
        
        return Credentials.from_authorized_user_info(token_data)
    
    def get_events(self, calendar_email='chris.cole.work1985@gmail.com', days=7):
        """Get upcoming events from calendar"""
        try:
            # Map email to token file
            if calendar_email == 'chris.cole.work1985@gmail.com':
                token_file = self.creds_dir / 'google-calendar-token.json'
            elif calendar_email == 'pjrobinson85@gmail.com':
                token_file = self.creds_dir / 'google-pj-calendar-token.json'
            else:
                return f"❌ Unknown calendar: {calendar_email}"
            
            if not token_file.exists():
                return f"❌ Token not found for {calendar_email}"
            
            creds = self._load_creds(token_file)
            service = build('calendar', 'v3', credentials=creds)
            
            from datetime import datetime, timedelta, timezone
            now = datetime.now(timezone.utc).isoformat()
            future = (datetime.now(timezone.utc) + timedelta(days=days)).isoformat()
            
            events_result = service.events().list(
                calendarId='primary',
                timeMin=now,
                timeMax=future,
                maxResults=10,
                singleEvents=True,
                orderBy='startTime'
            ).execute()
            
            events = events_result.get('items', [])
            return events
        except Exception as e:
            return f"❌ Error fetching calendar: {str(e)}"
    
    def create_event(self, summary, start_time, duration_hours=1, 
                     description='', calendar_email='chris.cole.work1985@gmail.com'):
        """Create an event on the calendar
        
        Args:
            summary: Event title
            start_time: datetime object or ISO string
            duration_hours: How long the event lasts
            description: Event description
            calendar_email: Which calendar (only chris.cole has write access)
        """
        if calendar_email != 'chris.cole.work1985@gmail.com':
            return f"❌ Can only write to chris.cole.work1985@gmail.com calendar"
        
        try:
            token_file = self.creds_dir / 'google-calendar-token.json'
            
            if not token_file.exists():
                return f"❌ Token not found for {calendar_email}"
            
            creds = self._load_creds(token_file)
            service = build('calendar', 'v3', credentials=creds)
            
            # Handle start_time
            if isinstance(start_time, str):
                start_dt = datetime.fromisoformat(start_time)
            else:
                start_dt = start_time
            
            end_dt = start_dt + timedelta(hours=duration_hours)
            
            event = {
                'summary': summary,
                'description': description,
                'start': {
                    'dateTime': start_dt.isoformat(),
                    'timeZone': 'Australia/Brisbane',
                },
                'end': {
                    'dateTime': end_dt.isoformat(),
                    'timeZone': 'Australia/Brisbane',
                },
            }
            
            created_event = service.events().insert(calendarId='primary', body=event).execute()
            
            return f"✅ Event created: {created_event['summary']} at {created_event['start'].get('dateTime')} (ID: {created_event['id']})"
        except Exception as e:
            return f"❌ Error creating event: {str(e)}"
    
    def update_event(self, event_id, updates, calendar_email='chris.cole.work1985@gmail.com'):
        """Update an existing event
        
        Args:
            event_id: The event ID to update
            updates: Dict with fields to update (summary, description, start, end, etc.)
            calendar_email: Which calendar
        """
        if calendar_email != 'chris.cole.work1985@gmail.com':
            return f"❌ Can only write to chris.cole.work1985@gmail.com calendar"
        
        try:
            token_file = self.creds_dir / 'google-calendar-token.json'
            
            if not token_file.exists():
                return f"❌ Token not found for {calendar_email}"
            
            creds = self._load_creds(token_file)
            service = build('calendar', 'v3', credentials=creds)
            
            # Get the event first
            event = service.events().get(calendarId='primary', eventId=event_id).execute()
            
            # Update it
            for key, value in updates.items():
                event[key] = value
            
            updated_event = service.events().update(calendarId='primary', eventId=event_id, body=event).execute()
            
            return f"✅ Event updated: {updated_event['summary']} (ID: {updated_event['id']})"
        except Exception as e:
            return f"❌ Error updating event: {str(e)}"
    
    def delete_event(self, event_id, calendar_email='chris.cole.work1985@gmail.com'):
        """Delete an event from the calendar"""
        if calendar_email != 'chris.cole.work1985@gmail.com':
            return f"❌ Can only write to chris.cole.work1985@gmail.com calendar"
        
        try:
            token_file = self.creds_dir / 'google-calendar-token.json'
            
            if not token_file.exists():
                return f"❌ Token not found for {calendar_email}"
            
            creds = self._load_creds(token_file)
            service = build('calendar', 'v3', credentials=creds)
            
            service.events().delete(calendarId='primary', eventId=event_id).execute()
            
            return f"✅ Event deleted (ID: {event_id})"
        except Exception as e:
            return f"❌ Error deleting event: {str(e)}"

# Quick test
if __name__ == '__main__':
    print("✅ Gmail & Calendar helpers loaded")
    print("   Use: from gmail_helper import GmailHelper, CalendarHelper")
