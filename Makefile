release: clean
	zip -r release.zip . -x release.zip .\*

.PHONY: clean
clean:
	rm release.zip || true
