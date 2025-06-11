param (
    [string]$Path = ".",
    [string[]]$ExcludeDirs = @(),
    [int]$MaxDepth = 5
)

function Show-Tree {
    param (
        [string]$Path = ".",
        [int]$Level = 0,
        [string[]]$ExcludeDirs = @(),
        [int]$MaxDepth = 1
    )

    if ($Level -ge $MaxDepth) {
        return
    }

    $indent = " " * ($Level * 4)

    Get-ChildItem -Path $Path | Where-Object {
        if ($_.PSIsContainer) {
            $ExcludeDirs -notcontains $_.Name
        }
        else {
            $true
        }
    } | ForEach-Object {
        if ($_.PSIsContainer) {
            Write-Output "$indent|-- $_"
            Show-Tree -Path $_.FullName -Level ($Level + 1) -ExcludeDirs $ExcludeDirs -MaxDepth $MaxDepth
        }
        else {
            Write-Output "$indent|-- $_"
        }
    }
}

$ExcludeDirs = ($ExcludeDirs + @("node_modules", ".git")) | Select-Object -Unique

# Call the function with user-supplied arguments
Show-Tree -Path $Path -ExcludeDirs $ExcludeDirs -MaxDepth $MaxDepth