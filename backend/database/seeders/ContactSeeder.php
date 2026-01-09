<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ContactSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('contacts')->insert([
            ['contact_id' => 1, 'resident_id' => 1, 'name' => 'Luc Janssens', 'relation' => 'Zoon', 'phone' => '0478123456', 'email' => 'luc.janssens@email.be', 'is_primary' => true],
            ['contact_id' => 2, 'resident_id' => 2, 'name' => 'Katrien Peeters', 'relation' => 'Dochter', 'phone' => '0479234567', 'email' => 'katrien.peeters@email.be', 'is_primary' => true],
            ['contact_id' => 3, 'resident_id' => 3, 'name' => 'Tom De Smet', 'relation' => 'Kleinzoon', 'phone' => '0476345678', 'email' => 'tom.desmet@email.be', 'is_primary' => true],
            ['contact_id' => 4, 'resident_id' => 4, 'name' => 'Sophie Van Damme', 'relation' => 'Nicht', 'phone' => '0477456789', 'email' => 'sophie.vandamme@email.be', 'is_primary' => true],
            ['contact_id' => 5, 'resident_id' => 5, 'name' => 'Pieter Claes', 'relation' => 'Zoon', 'phone' => '0475567890', 'email' => 'pieter.claes@email.be', 'is_primary' => true],
            ['contact_id' => 6, 'resident_id' => 6, 'name' => 'Linda Maes', 'relation' => 'Dochter', 'phone' => '0474678901', 'email' => 'linda.maes@email.be', 'is_primary' => true],
            ['contact_id' => 7, 'resident_id' => 7, 'name' => 'Marc Vermeulen', 'relation' => 'Zoon', 'phone' => '0473789012', 'email' => 'marc.vermeulen@email.be', 'is_primary' => true],
            ['contact_id' => 8, 'resident_id' => 8, 'name' => 'Els Willems', 'relation' => 'Dochter', 'phone' => '0472890123', 'email' => 'els.willems@email.be', 'is_primary' => true],
            ['contact_id' => 9, 'resident_id' => 9, 'name' => 'Jan Wouters', 'relation' => 'Zoon', 'phone' => '0471901234', 'email' => 'jan.wouters@email.be', 'is_primary' => true],
            ['contact_id' => 10, 'resident_id' => 10, 'name' => 'Anne Goossens', 'relation' => 'Kleindochter', 'phone' => '0470012345', 'email' => 'anne.goossens@email.be', 'is_primary' => true],
            ['contact_id' => 11, 'resident_id' => 11, 'name' => 'Dirk De Vos', 'relation' => 'Zoon', 'phone' => '0469123456', 'email' => 'dirk.devos@email.be', 'is_primary' => true],
            ['contact_id' => 12, 'resident_id' => 12, 'name' => 'Marie Jacobs', 'relation' => 'Nicht', 'phone' => '0468234567', 'email' => 'marie.jacobs@email.be', 'is_primary' => true],
            ['contact_id' => 13, 'resident_id' => 13, 'name' => 'Paul Van den Berg', 'relation' => 'Zoon', 'phone' => '0467345678', 'email' => 'paul.vandenberg@email.be', 'is_primary' => true],
            ['contact_id' => 14, 'resident_id' => 14, 'name' => 'Hilde Mertens', 'relation' => 'Dochter', 'phone' => '0466456789', 'email' => 'hilde.mertens@email.be', 'is_primary' => true],
            ['contact_id' => 15, 'resident_id' => 15, 'name' => 'Kris Dubois', 'relation' => 'Zoon', 'phone' => '0465567890', 'email' => 'kris.dubois@email.be', 'is_primary' => true],
            ['contact_id' => 16, 'resident_id' => 16, 'name' => 'Sara Lemmens', 'relation' => 'Kleindochter', 'phone' => '0464678901', 'email' => 'sara.lemmens@email.be', 'is_primary' => true],
            ['contact_id' => 17, 'resident_id' => 17, 'name' => 'Frank Hermans', 'relation' => 'Zoon', 'phone' => '0463789012', 'email' => 'frank.hermans@email.be', 'is_primary' => true],
            ['contact_id' => 18, 'resident_id' => 18, 'name' => 'Ingrid Pauwels', 'relation' => 'Dochter', 'phone' => '0462890123', 'email' => 'ingrid.pauwels@email.be', 'is_primary' => true],
            ['contact_id' => 19, 'resident_id' => 19, 'name' => 'Geert Claessens', 'relation' => 'Zoon', 'phone' => '0461901234', 'email' => 'geert.claessens@email.be', 'is_primary' => true],
            ['contact_id' => 20, 'resident_id' => 20, 'name' => 'Martine De Cock', 'relation' => 'Nicht', 'phone' => '0460012345', 'email' => 'martine.decock@email.be', 'is_primary' => true],
            ['contact_id' => 21, 'resident_id' => 21, 'name' => 'Wim Stevens', 'relation' => 'Neef', 'phone' => '0459123456', 'email' => 'wim.stevens@email.be', 'is_primary' => true],
            ['contact_id' => 22, 'resident_id' => 22, 'name' => 'Nathalie Michiels', 'relation' => 'Dochter', 'phone' => '0458234567', 'email' => 'nathalie.michiels@email.be', 'is_primary' => true],
            ['contact_id' => 23, 'resident_id' => 23, 'name' => 'Philippe Lambert', 'relation' => 'Zoon', 'phone' => '0457345678', 'email' => 'philippe.lambert@email.be', 'is_primary' => true],
            ['contact_id' => 24, 'resident_id' => 24, 'name' => 'Isabelle Van Hove', 'relation' => 'Kleindochter', 'phone' => '0456456789', 'email' => 'isabelle.vanhove@email.be', 'is_primary' => true],
            ['contact_id' => 25, 'resident_id' => 25, 'name' => 'Joris Bogaert', 'relation' => 'Kleinzoon', 'phone' => '0455567890', 'email' => 'joris.bogaert@email.be', 'is_primary' => true],
        ]);
    }
}
