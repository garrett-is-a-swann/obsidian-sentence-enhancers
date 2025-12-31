import { MarkdownView, Plugin, type TFile } from 'obsidian';
import { moment } from 'obsidian';

export default class SentenceEnhancersPlugin extends Plugin {
    class_prefix = 'ose';
    chrono_classes: {
        [id: string]: {
            class: string,
            tid: ReturnType<typeof setTimeout>,
        }
    } = {};

    async onload() {
        this.registerEvent(this.app.workspace.on('file-open', this.handleNextFile));

        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (view && view.file) {
            this.handleNextFile(view.file);
        }

        this.generateChronoClasses();
    }

    onunload() {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (view) {
            this.removeEnhancerClasses(view.contentEl);
        }

        this.removeEnhancerClasses(this.app.workspace.containerEl);
        for (const key in this.chrono_classes) {
            clearTimeout(this.chrono_classes[key].tid);
        }
    }

    removeEnhancerClasses = (element: HTMLElement) => {
        element.removeClasses(
            element.classList.value
                .split(" ")
                .filter(c => c.startsWith(this.class_prefix))
        );
    };

    handleNextFile = (tfile: TFile) => {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!view) {
            console.error("SentenceEnhancers: MarkdownView not available on next file-open event.")
            return;
        }

        this.removeEnhancerClasses(view.contentEl);

        const classes = [
            ...this.generateFrontmatterClasses(tfile),
        ];

        view?.contentEl.addClasses(classes);
    }

    generateChronoClasses = () => {
        const chrono_container = this.app.workspace.containerEl;
        const chronoTimeout = (key: string, next: (now: Date) => [string, Date]) => {
            if (this.chrono_classes[key]) {
                chrono_container.removeClass(this.chrono_classes[key].class);
            }
            const now = new Date();
            const [nextClass, until] = next(now);

            chrono_container.addClass(nextClass);

            const timeUntil = until.getTime() - now.getTime();

            // Set a timeout to run the function when the day changes
            this.chrono_classes[key] = {
                class: nextClass,
                tid: setTimeout(() => {
                    chronoTimeout(key, next);
                }, timeUntil)
            }
        }

        chronoTimeout('month', (date) => {
            const currentMoment = moment(date);
            return [`${this.class_prefix}_${currentMoment.format("MMMM")}`.toLowerCase(), currentMoment.startOf('month').add(1, 'month').toDate()];
        });
        chronoTimeout('day-of-week', (now) => {
            const currentMoment = moment(now);
            return [`${this.class_prefix}_${currentMoment.format("dddd")}`.toLowerCase(), currentMoment.startOf('day').add(1, 'day').toDate()];
        });
        chronoTimeout('day-#', (date) => {
            const currentMoment = moment(date);
            return [`${this.class_prefix}_day-${currentMoment.format("DD")}`.toLowerCase(), currentMoment.startOf('day').add(1, 'day').toDate()];
        });
        chronoTimeout('hour-#', (date) => {
            const currentMoment = moment(date);
            return [`${this.class_prefix}_hour-${currentMoment.format("HH")}`.toLowerCase(), currentMoment.startOf('hour').add(1, 'hour').toDate()];
        });
        chronoTimeout('minute-#', (date) => {
            const currentMoment = moment(date);
            return [`${this.class_prefix}_minute-${currentMoment.format("mm")}`.toLowerCase(), currentMoment.startOf('minute').add(1, 'minute').toDate()];
        });
    }

    generateFrontmatterClasses = (file: TFile) => {
        const frontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter ?? {};
        const classes: string[] = [];
        for (const key in frontmatter) {
            if (key === 'cssclasses') {
                // This is unnecessary enough as it is.
                // No need to be redundant
                continue;
            }
            this.handleType(classes, key, frontmatter[key]);
        }
        return classes;
    }

    handleType = (classes: string[], path: string, value: any): void => {
        const type = typeof value;
        switch (type) {
            case 'object': {
                if (Array.isArray(value)) {
                    this.handleArrayFrontmatter(classes, path, value);
                }
                else if (value === null) {
                    classes.push(`${this.class_prefix}--${path}`.replace(/\s+/g, '-').replace(/[^_a-zA-Z0-9-]/, '').toLowerCase());
                }
                else {
                    for (const key in value) {
                        this.handleType(classes, `${path}-${key}`, value[key]);
                    }
                }
                break;
            }
            default: {
                classes.push(`${this.class_prefix}--${path}-${value}`.replace(/\s+/g, '-').replace(/[^_a-zA-Z0-9-]/, '').toLowerCase());
            }
        }
    }

    handleArrayFrontmatter = (classes: string[], path: string, arr: any[]): void => {
        for (const item of arr) {
            this.handleType(classes, path, item);
        }
    }
}
