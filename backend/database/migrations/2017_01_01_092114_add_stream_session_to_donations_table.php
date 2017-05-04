<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddStreamSessionToDonationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('donations', function (Blueprint $table) {
            $table->integer('stream_id')->unsigned()->nullable()->default(null);
            $table->foreign('stream_id')->references('id')->on('streams');
        });
        Schema::table('song_requests', function (Blueprint $table) {
            $table->integer('stream_id')->unsigned()->nullable()->default(null);
            $table->foreign('stream_id')->references('id')->on('streams');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('donations', function (Blueprint $table) {
            $table->dropForeign(['stream_id']);
            $table->dropColumn('stream_id');
        });
        Schema::table('song_requests', function (Blueprint $table) {
            $table->dropForeign(['stream_id']);
            $table->dropColumn('stream_id');
        });
    }
}
