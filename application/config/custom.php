<?php
defined('BASEPATH') OR exit('No direct script access allowed');

# Time to expire login session in seconds.
$config['user_sid_time'] = 259200; // 3 days

# Time to expire user token.
$config['user_token_time'] = 86400; // 1 day

# Time to expire API token.
$config['api_token_time'] = 7200; // 2 hours

# System email sender.
$config['system_email'] = 'statsui@rtb.cat'; // 1 day