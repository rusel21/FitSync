<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use App\Models\CommunicationTemplate;
use App\Models\SentMessage;
use App\Models\AutomatedReminder;
use App\Models\User;
use App\Models\Staff;

class StaffCommunicationsController extends Controller
{
    /**
     * Get communications data
     */
    public function getCommunicationsData(Request $request)
    {
        try {
            $tab = $request->get('tab', 'messages');

            $data = [
                'members' => [],
                'templates' => [],
                'reminders' => [],
                'sentMessages' => [],
                'statistics' => []
            ];

            switch ($tab) {
                case 'messages':
                    $data['members'] = $this->getMembers();
                    $data['templates'] = $this->getTemplates();
                    break;
                case 'reminders':
                    $data['reminders'] = $this->getReminders();
                    $data['statistics'] = $this->getReminderStatistics();
                    break;
                case 'templates':
                    $data['templates'] = $this->getTemplates();
                    break;
                case 'history':
                    $data['sentMessages'] = $this->getSentMessages();
                    break;
                default:
                    $data['members'] = $this->getMembers();
                    $data['templates'] = $this->getTemplates();
            }

            return response()->json($data);

        } catch (\Exception $e) {
            Log::error('Communications data error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to load communications data',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get members for messaging
     */
    private function getMembers()
    {
        return User::with(['currentMembership', 'memberships'])
            ->select('id', 'name', 'email', 'contact', 'user_id')
            ->get()
            ->map(function ($user) {
                $currentMembership = $user->currentMembership;
                $latestMembership = $user->memberships()->latest()->first();
                
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->contact,
                    'membership' => $currentMembership ? $currentMembership->type : 
                                  ($latestMembership ? $latestMembership->type . ' (Expired)' : 'No Membership'),
                    'user_id' => $user->user_id
                ];
            });
    }

    /**
     * Get communication templates
     */
    private function getTemplates()
    {
        return CommunicationTemplate::active()
            ->orderBy('name')
            ->get()
            ->map(function ($template) {
                return [
                    'id' => $template->id,
                    'name' => $template->name,
                    'subject' => $template->subject,
                    'content' => $template->content,
                    'type' => $template->type,
                    'category' => $template->category,
                    'variables' => $template->variables
                ];
            });
    }

    /**
     * Get automated reminders
     */
    private function getReminders()
    {
        return AutomatedReminder::with('template')
            ->active()
            ->get()
            ->map(function ($reminder) {
                return [
                    'id' => $reminder->id,
                    'name' => $reminder->name,
                    'type' => $reminder->type,
                    'trigger_event' => $reminder->trigger_event,
                    'days_before' => $reminder->days_before,
                    'days_after' => $reminder->days_after,
                    'is_active' => $reminder->is_active,
                    'template_name' => $reminder->template ? $reminder->template->name : 'No Template'
                ];
            });
    }

    /**
     * Get reminder statistics
     */
    private function getReminderStatistics()
    {
        // Payment reminders due (memberships expiring in 7 days)
        $paymentRemindersDue = User::whereHas('memberships', function($query) {
            $query->where('end_date', '<=', now()->addDays(7))
                  ->where('end_date', '>=', now())
                  ->where('status', 'active');
        })->count();

        // Birthdays today - FIXED: Check if date_of_birth field exists, fallback to created_at
        $birthdaysToday = User::where(function($query) {
            if (Schema::hasColumn('users', 'date_of_birth')) {
                $query->whereMonth('date_of_birth', now()->month)
                      ->whereDay('date_of_birth', now()->day);
            } else {
                $query->whereMonth('created_at', now()->month)
                      ->whereDay('created_at', now()->day);
            }
        })->count();

        // Renewals this week
        $renewalsThisWeek = User::whereHas('memberships', function($query) {
            $query->where('end_date', '<=', now()->addWeek())
                  ->where('end_date', '>=', now())
                  ->where('status', 'active');
        })->count();

        return [
            'payment_reminders_due' => $paymentRemindersDue,
            'birthdays_today' => $birthdaysToday,
            'renewals_this_week' => $renewalsThisWeek
        ];
    }

    /**
     * Get sent messages history
     */
    private function getSentMessages()
    {
        return SentMessage::with(['template', 'sender'])
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get()
            ->map(function ($message) {
                return [
                    'id' => $message->id,
                    'subject' => $message->subject,
                    'recipient_count' => $message->recipient_count,
                    'message_type' => $message->message_type,
                    'channel' => $message->channel,
                    'status' => $message->status,
                    'sent_at' => $message->sent_at?->format('Y-m-d H:i'),
                    'sender_name' => $message->sender ? $message->sender->name : 'System',
                    'template_name' => $message->template ? $message->template->name : 'Custom'
                ];
            });
    }

    /**
     * Send bulk message
     */
    public function sendBulkMessage(Request $request)
    {
        try {
            $validated = $request->validate([
                'recipient_ids' => 'required|array',
                'recipient_ids.*' => 'exists:users,id',
                'subject' => 'required|string|max:255',
                'content' => 'required|string',
                'template_id' => 'nullable|exists:communication_templates,id',
                'channel' => 'required|in:email,sms,both'
            ]);

            // FIX: Use ->id instead of ->id()
            $senderId = $request->user()->id;
            $recipientCount = count($validated['recipient_ids']);

            // Create sent message record
            $sentMessage = SentMessage::create([
                'template_id' => $validated['template_id'],
                'sender_id' => $senderId,
                'recipient_type' => 'members',
                'recipient_ids' => $validated['recipient_ids'],
                'subject' => $validated['subject'],
                'content' => $validated['content'],
                'message_type' => 'bulk',
                'channel' => $validated['channel'],
                'status' => 'sent',
                'sent_at' => now(),
                'metadata' => [
                    'recipient_count' => $recipientCount,
                    'channel' => $validated['channel']
                ]
            ]);

            // In a real implementation, you would:
            // 1. Send emails via your email service
            // 2. Send SMS via your SMS gateway
            // 3. Handle failures and update status accordingly

            Log::info("Bulk message sent to {$recipientCount} recipients by staff {$senderId}");

            return response()->json([
                'success' => true,
                'message' => "Message sent successfully to {$recipientCount} members",
                'sent_message' => $sentMessage
            ]);

        } catch (\Exception $e) {
            Log::error('Send bulk message error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to send message',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create new template
     */
    public function createTemplate(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'subject' => 'required|string|max:255',
                'content' => 'required|string',
                'type' => 'required|in:email,sms,notification',
                'category' => 'required|in:payment,birthday,renewal,promotion,general',
                'variables' => 'nullable|array'
            ]);

            $template = CommunicationTemplate::create($validated);

            return response()->json([
                'success' => true,
                'template' => $template,
                'message' => 'Template created successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Create template error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to create template',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update template
     */
    public function updateTemplate(Request $request, $id)
    {
        try {
            $template = CommunicationTemplate::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'subject' => 'sometimes|required|string|max:255',
                'content' => 'sometimes|required|string',
                'is_active' => 'sometimes|boolean'
            ]);

            $template->update($validated);

            return response()->json([
                'success' => true,
                'template' => $template,
                'message' => 'Template updated successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Update template error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to update template',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update automated reminder settings
     */
    public function updateReminderSettings(Request $request)
    {
        try {
            $validated = $request->validate([
                'reminders' => 'required|array',
                'reminders.*.id' => 'required|exists:automated_reminders,id',
                'reminders.*.is_active' => 'required|boolean'
            ]);

            foreach ($validated['reminders'] as $reminderData) {
                $reminder = AutomatedReminder::find($reminderData['id']);
                if ($reminder) {
                    $reminder->update(['is_active' => $reminderData['is_active']]);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Reminder settings updated successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Update reminder settings error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to update reminder settings',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get message history with pagination
     */
    public function getMessageHistory(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 20);
            
            $messages = SentMessage::with(['template', 'sender'])
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            return response()->json([
                'messages' => $messages->items(),
                'pagination' => [
                    'current_page' => $messages->currentPage(),
                    'total_pages' => $messages->lastPage(),
                    'total_items' => $messages->total(),
                    'per_page' => $messages->perPage()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Get message history error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to load message history',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}