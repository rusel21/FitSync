<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\SentMessage;

class CommunicationTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'subject',
        'content',
        'type',
        'category',
        'is_active',
        'variables'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'variables' => 'array'
    ];

    /**
     * Get sent messages using this template
     */
    public function sentMessages()
    {
        return $this->hasMany(SentMessage::class);
    }

    /**
     * Scope active templates
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope by type
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Parse template content with variables
     */
    public function parseContent($variables = [])
    {
        $content = $this->content;
        
        foreach ($variables as $key => $value) {
            $content = str_replace("{{$key}}", $value, $content);
        }
        
        return $content;
    }
}