<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChangeField extends Model
{
    use HasFactory;

    protected $table = 'change_fields';
    protected $primaryKey = 'field_id';

    public $timestamps = false;

    protected $fillable = [
        'request_id',
        'field_name',
        'old',
        'new',
    ];

    public function changeRequest()
    {
        return $this->belongsTo(ChangeRequest::class, 'request_id', 'request_id');
    }
}
