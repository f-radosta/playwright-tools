#!/bin/bash

# Configuration
SOURCE="/home/filip/eBrana/playwright-tools/tests"
TARGET="/home/filip/eBrana/internal-tools/tests-e2e"
DIRS="internal-training meal-ordering shared"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to handle conflicts
handle_conflict() {
    local file=$1
    local source_path="$SOURCE/$file"
    local target_path="$TARGET/$file"
    
    echo -e "⚠️ CONFLICT: File modified in both locations: $file"
    echo "Options:"
    echo "  1) Don't sync this file (default)"
    echo "  2) Local wins (source path: $source_path)"
    echo "  3) Tools wins (target path: $target_path)"
    
    read -p "Choose option [1-3]: " choice
    
    case "$choice" in
        2)
            echo -e "✅ Using local version"
            mkdir -p "$(dirname "$target_path")"
            cp -f "$source_path" "$target_path"
            ;;
        3)
            echo -e "✅ Using tools version"
            mkdir -p "$(dirname "$source_path")"
            cp -f "$target_path" "$source_path"
            ;;
        *)
            echo -e "⚠️ Skipping this file"
            ;;
    esac
}

# Function to sync files with confirmation
sync_files() {
    local dry_run=$1
    local conflicts_found=0
    
    echo -e "🔍 Checking for conflicts..."
    
    # First pass: detect conflicts
    for dir in $DIRS; do
        if [ -d "$SOURCE/$dir" ] && [ -d "$TARGET/$dir" ]; then
            for file in $(find "$SOURCE/$dir" -type f -name "*.spec.ts" | sed "s|$SOURCE/||g"); do
                target_file="$TARGET/$file"
                source_file="$SOURCE/$file"
                
                if [ -f "$target_file" ] && [ -f "$source_file" ] && ! cmp -s "$source_file" "$target_file"; then
                    conflicts_found=1
                    if [ "$dry_run" = false ]; then
                        handle_conflict "$file"
                    else
                        echo -e "⚠️ CONFLICT DETECTED: File modified in both locations: $file"
                        echo "  This conflict will require resolution during actual sync."
                    fi
                fi
            done
        fi
    done
    
    # Create temp files to store file lists before sync
    if [ "$dry_run" = false ]; then
        # Create lists of files before sync for comparison
        for dir in $DIRS; do
            if [ -d "$SOURCE/$dir" ]; then
                find "$SOURCE/$dir" -type f -name "*.spec.ts" | sed "s|$SOURCE/||g" | sort > "/tmp/source_files_before_$dir.txt"
            fi
            if [ -d "$TARGET/$dir" ]; then
                find "$TARGET/$dir" -type f -name "*.spec.ts" | sed "s|$TARGET/||g" | sort > "/tmp/target_files_before_$dir.txt"
            fi
        done
    fi
    
    # If dry run, stop here
    if [ "$dry_run" = true ]; then
        if [ $conflicts_found -eq 0 ]; then
            echo -e "✅ No conflicts detected."
        fi
        echo -e "🔄 Files that would be synced:"
    else
        echo -e "🔄 Syncing files..."
    fi
    
    # Second pass: perform the actual sync for non-conflicting files
    for dir in $DIRS; do
        # Source to Target sync
        if [ -d "$SOURCE/$dir" ]; then
            if [ "$dry_run" = true ]; then
                # Handle regular changes
                rsync -avucn --delete --itemize-changes "$SOURCE/$dir/" "$TARGET/$dir/" | 
                grep -E "^[>|c|s|t]" | grep -v "incremental file list" | 
                grep -v "bytes" | grep -v "size is" | sed 's/^[^ ]* //' | 
                sed "s/^/🔄 From local to tools: /"
                
                # Handle deleted files separately
                rsync -avucn --delete --itemize-changes "$SOURCE/$dir/" "$TARGET/$dir/" | 
                grep -E "^\*deleting" | 
                sed "s/^\*deleting   /🔄 From local to tools (DELETED): /"
            else
                # Handle regular changes
                rsync -avuc --delete --itemize-changes "$SOURCE/$dir/" "$TARGET/$dir/" | 
                grep -E "^[>|c|s|t]" | grep -v "incremental file list" | 
                grep -v "bytes" | grep -v "size is" | sed 's/^[^ ]* //' | 
                sed "s/^/🔄 From local to tools: /"
                
                # Handle deleted files separately
                rsync -avuc --delete --itemize-changes "$SOURCE/$dir/" "$TARGET/$dir/" | 
                grep -E "^\*deleting" | 
                sed "s/^\*deleting   /🔄 From local to tools (DELETED): /"
            fi
        fi
        
        # Target to Source sync
        if [ -d "$TARGET/$dir" ]; then
            if [ "$dry_run" = true ]; then
                # Handle regular changes
                rsync -avucn --delete --itemize-changes "$TARGET/$dir/" "$SOURCE/$dir/" | 
                grep -E "^[>|c|s|t]" | grep -v "incremental file list" | 
                grep -v "bytes" | grep -v "size is" | sed 's/^[^ ]* //' | 
                sed "s/^/🔄 From tools to local: /"
                
                # Handle deleted files separately
                rsync -avucn --delete --itemize-changes "$TARGET/$dir/" "$SOURCE/$dir/" | 
                grep -E "^\*deleting" | 
                sed "s/^\*deleting   /🔄 From tools to local (DELETED): /"
            else
                # Handle regular changes
                rsync -avuc --delete --itemize-changes "$TARGET/$dir/" "$SOURCE/$dir/" | 
                grep -E "^[>|c|s|t]" | grep -v "incremental file list" | 
                grep -v "bytes" | grep -v "size is" | sed 's/^[^ ]* //' | 
                sed "s/^/🔄 From tools to local: /"
                
                # Handle deleted files separately
                rsync -avuc --delete --itemize-changes "$TARGET/$dir/" "$SOURCE/$dir/" | 
                grep -E "^\*deleting" | 
                sed "s/^\*deleting   /🔄 From tools to local (DELETED): /"
            fi
        fi
    done
    
    # For actual sync, compare files before and after to detect deletions
    if [ "$dry_run" = false ]; then
        for dir in $DIRS; do
            if [ -d "$SOURCE/$dir" ]; then
                # Find files after sync
                find "$SOURCE/$dir" -type f -name "*.spec.ts" | sed "s|$SOURCE/||g" | sort > "/tmp/source_files_after_$dir.txt"
                
                # Compare before and after to find deleted files
                if [ -f "/tmp/source_files_before_$dir.txt" ] && [ -f "/tmp/source_files_after_$dir.txt" ]; then
                    comm -23 "/tmp/source_files_before_$dir.txt" "/tmp/source_files_after_$dir.txt" | while read -r deleted_file; do
                        echo -e "🔄 From tools to local (DELETED): $deleted_file"
                    done
                fi
                
                # Find files after sync in target
                find "$TARGET/$dir" -type f -name "*.spec.ts" | sed "s|$TARGET/||g" | sort > "/tmp/target_files_after_$dir.txt"
                
                # Compare before and after to find deleted files
                if [ -f "/tmp/target_files_before_$dir.txt" ] && [ -f "/tmp/target_files_after_$dir.txt" ]; then
                    comm -23 "/tmp/target_files_before_$dir.txt" "/tmp/target_files_after_$dir.txt" | while read -r deleted_file; do
                        echo -e "🔄 From local to tools (DELETED): $deleted_file"
                    done
                fi
            fi
        done
    fi
    
    if [ "$dry_run" = true ]; then
        echo -e "✅ Dry run complete."
    else
        echo -e "✅ Sync complete."
    fi
}

# Main script logic
case "$1" in
    dry)
        echo -e "🔄 Dry run of syncing between $SOURCE and $TARGET"
        sync_files true
        ;;
    *)
        echo -e "🔄 Smart syncing between $SOURCE and $TARGET"
        sync_files false
        ;;
esac
