.PHONY: sync sync-dry show-trace copy-trace trace

# Regular sync (actual sync)
sync:
	@./sync.sh

# Dry run sync (simulated sync)
sync-dry:
	@./sync.sh dry

# Copy trace from internal-tools to local repository
# Usage: make copy-trace [N=number]
copy-trace:
	@echo "🔍 Copying trace from internal-tools..."
	@echo "🧹 Cleaning local test-results directory..."
	@rm -rf ./test-results/*
	@mkdir -p ./test-results/
	@mkdir -p "./test-results/internal-training-tests-cr-62af9-and-delete-training-as-user-chromium"
	@TOOLS_DIR=/home/filip/eBrana/internal-tools/test-results/internal-training-tests-cr-a20b9-and-delete-training-as-user-chromium; \
	LOCAL_DIR=./test-results/internal-training-tests-cr-62af9-and-delete-training-as-user-chromium; \
	TRACE_COUNT=$$(find "$$TOOLS_DIR" -name "*.zip" | wc -l); \
	if [ $$TRACE_COUNT -eq 0 ]; then \
		echo "⚠️ No trace files found in $$TOOLS_DIR"; \
		exit 1; \
	fi; \
	N=$${N:-1}; \
	if [ $$N -gt $$TRACE_COUNT ]; then \
		echo "⚠️ Requested trace number $$N, but only $$TRACE_COUNT traces available"; \
		echo "Using the last available trace instead"; \
		N=$$TRACE_COUNT; \
	fi; \
	SELECTED_TRACE=$$(find "$$TOOLS_DIR" -name "*.zip" | sort | sed -n "$$N p"); \
	cp -v "$$SELECTED_TRACE" "$$LOCAL_DIR/"; \
	echo "✅ Trace copied to $$LOCAL_DIR/$$(basename "$$SELECTED_TRACE")"; \
	echo "Run 'make show-trace' to view the trace"

# Show a Playwright trace
# Usage: make show-trace
show-trace:
	@echo "🔍 Opening trace viewer..."
	@LOCAL_DIR=./test-results/internal-training-tests-cr-62af9-and-delete-training-as-user-chromium; \
	if [ ! -d "$$LOCAL_DIR" ]; then \
		echo "⚠️ Trace directory not found: $$LOCAL_DIR"; \
		echo "Try copying it first with: make copy-trace"; \
		exit 1; \
	fi; \
	TRACE_FILE=$$(find "$$LOCAL_DIR" -name "*.zip" | head -n 1); \
	if [ -z "$$TRACE_FILE" ]; then \
		echo "⚠️ No trace files found in $$LOCAL_DIR"; \
		echo "Try copying it first with: make copy-trace"; \
		exit 1; \
	fi; \
	echo "📊 Opening trace: $$TRACE_FILE"; \
	npx playwright show-trace "$$TRACE_FILE"

# Combined command to copy and show trace
# Usage: make trace [N=number]
trace:
	@$(MAKE) copy-trace N=$(N)
	@$(MAKE) show-trace
