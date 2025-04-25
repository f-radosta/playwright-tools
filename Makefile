.PHONY: sync sync-dry

# Regular sync (actual sync)
sync:
	@./sync.sh

# Dry run sync (simulated sync)
sync-dry:
	@./sync.sh dry
