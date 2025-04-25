.PHONY: sync sync-dry show-trace copy-trace

# Regular sync (actual sync)
sync:
	@./sync.sh

# Dry run sync (simulated sync)
sync-dry:
	@./sync.sh dry

# Copy trace from internal-tools to local repository
copy-trace:
	@echo "🔍 Copying trace from internal-tools..."
	@mkdir -p ./test-results/
	@if [ -z "$(TRACE)" ]; then \
		echo "⚠️ Please specify a trace path with TRACE=path/to/trace.zip"; \
		echo "Example: make copy-trace TRACE=internal-training-tests-cr-e8ea2-and-delete-category-as-user-webkit/trace.zip"; \
		exit 1; \
	fi
	@cp -v /home/filip/eBrana/internal-tools/test-results/$(TRACE) ./test-results/
	@echo "✅ Trace copied to ./test-results/$(TRACE)"
	@echo "Run 'make show-trace TRACE=$(TRACE)' to view the trace"

# Show a Playwright trace
show-trace:
	@echo "🔍 Opening trace viewer..."
	@if [ -z "$(TRACE)" ]; then \
		echo "⚠️ Please specify a trace path with TRACE=path/to/trace.zip"; \
		echo "Example: make show-trace TRACE=internal-training-tests-cr-e8ea2-and-delete-category-as-user-webkit/trace.zip"; \
		exit 1; \
	fi
	@if [ ! -f "./test-results/$(TRACE)" ]; then \
		echo "⚠️ Trace file not found: ./test-results/$(TRACE)"; \
		echo "Try copying it first with: make copy-trace TRACE=$(TRACE)"; \
		exit 1; \
	fi
	@npx playwright show-trace ./test-results/$(TRACE)
