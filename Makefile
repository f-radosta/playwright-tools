SOURCE := /home/filip/eBrana/playwright-tools/tests
TARGET := /home/filip/eBrana/internal-tools/tests-e2e
DIRS := internal-training meal-ordering shared

.PHONY: sync rsync

sync:
	@echo "🧹 Deleting old directories from $(TARGET)"
	@for dir in $(DIRS); do \
		rm -rf $(TARGET)/$$dir && \
		echo "Deleted $(TARGET)/$$dir"; \
	done
	@echo "📥 Copying directories from $(SOURCE) to $(TARGET)"
	@for dir in $(DIRS); do \
		cp -r $(SOURCE)/$$dir $(TARGET)/ && \
		echo "Copied $$dir"; \
	done
	@echo "✅ Sync complete."

rsync:
	@echo "🧹 Deleting old directories from $(SOURCE)"
	@for dir in $(DIRS); do \
		rm -rf $(SOURCE)/$$dir && \
		echo "Deleted $(SOURCE)/$$dir"; \
	done
	@echo "📥 Copying directories from $(TARGET) to $(SOURCE)"
	@for dir in $(DIRS); do \
		cp -r $(TARGET)/$$dir $(SOURCE)/ && \
		echo "Copied $$dir"; \
	done
	@echo "✅ Reverse sync complete."
