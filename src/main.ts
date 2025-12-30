import { MarkdownView, Plugin, type TFile } from 'obsidian';
import { moment } from 'obsidian';

export default class SentenceEnhancersPlugin extends Plugin {
    class_prefix = 'ose';

    async onload() {
        this.registerEvent(this.app.workspace.on('file-open', this.handleNextFile));

        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (view && view.file) {
            this.handleNextFile(view.file);
        }
    }

    onunload() {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (view) {
            this.removeEnhancerClasses(view);
        }
    }

    removeEnhancerClasses = (view: MarkdownView) => {
        view?.contentEl.removeClasses(
            view?.contentEl.classList.value
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
        this.removeEnhancerClasses(view);

        const classes = [
            ...this.generateFrontmatterClasses(tfile),
            ...this.generateChronoClasses(),
        ];

        view?.contentEl.addClasses(classes);
    }

    generateChronoClasses = () => {
        const classes: string[] = [
            moment().format("MMMM"),
            moment().format("dddd"),
            `day-${moment().format("DD")}`,
        ].map(c =>
            `${this.class_prefix}_${c.toLocaleLowerCase()}`
        );
        return classes;
    }

    generateFrontmatterClasses = (file: TFile) => {
        const frontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter ?? {};
        const classes: string[] = [];
        for (const key in frontmatter) {
            if (key === 'cssclasses') {
                // This is unnecessary enough as it is lmao
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
