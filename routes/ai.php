<?php

use App\Mcp\Servers\ReportSummaryServer;
use Laravel\Mcp\Server\Facades\Mcp;

Mcp::web('/summary/{trainee}',  ReportSummaryServer::class); // Available at /mcp/demo
// Mcp::local('demo', \App\Mcp\Servers\LocalServer::class); // Start with ./artisan mcp:start demo
