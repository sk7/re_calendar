release: clean
	zip -r release.zip . -x release.zip .\* screenshots/\* Makefile

.PHONY: clean
clean:
	rm release.zip || true
