# Obsidian Sentence Enhancers 🧽🍍🪼🫧

An [Obsidian](https://obsidian.md/) plugin that supplements the workspace/markdown editor node class lists with contextual information information to enhance customization by snippets and themes.

![sentence-enhancers-spongebob-gif](https://media1.tenor.com/m/vdhw6gbnBlMAAAAd/sentence-enhancer-sponge-bob.gif)

# Classes

Obsidian Sentence Enhancers will add classes to the workspace/a file's MarkdownView container element, prefixed with `ose_`/`ose--`. Users and theme-writers can use these classes to personalize the view of the notes.

Example:

For a very merry (and blinding) christmas!
```css
.ose_december.ose_day-25 {
    background: red!important;
    *:nth-child(odd) {
        color: green!important;
    }
    *:nth-child(even) {
        color: white!important;
    }
}
```

Thankful for turkeys aplenty.
```css
.ose_november.ose_thursday {
    &.ose_day-22, &.ose_day-23, &.ose_day-24, &.ose_day-25, &.ose_day-26, &.ose_day-27, &.ose_day-28 {
        *::after {
            content: "🦃"
        }
    }
}
```

Flash the workspace ribbon as a meeting reminder.
```css
@keyframes flash {
    0% {
        background-color: var(--color-accent);
    }
    50% {
        background-color: color-mix(in srgb, var(--color-accent) 50%, var(--ribbon-background));
    }
    100% {
        background-color: var(--ribon-background);
    }
}

.ose_wednesday.ose_hour-12.ose_minute-30 .workspace-ribbon {
    transition: background-color 0.5s;

    animation-name: flash;
    animation-duration: 0.5s;
    animation-iteration-count: 3;
    animation-timing-function: ease-out;
    animation-fill-mode: forwards;
}
```

Wednesday-ify your notes, my dudes 🐸
```css
.ose_april.ose_day-1.ose_wednesday::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    pointer-events: none;
    opacity: .15;
    background: url('https://i.kym-cdn.com/photos/images/original/001/091/264/665.jpg');
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
```

## Temporal Information

I add the following css classes for temporal information:

### Month
Example: ose_january, ose_february, ose_march... etc

---

### Day of the Week
Example: ose_monday, ose_tuesday, ose_wednesday... etc

---

### Day of the Month
Example: ose_day-01, ose_day-02, ...ose_day-13... etc

---

### Hour
Example: ose_hour-01, ose_hour-02, ...ose_hour-13... etc

---

### Minute
Example: ose_minute-01, ose_minute-02, ...ose_minute-50... etc

---


## Frontmatter Context

I add all metadata from the opened file's frontmatter as ose classes to the view container, as `key-value`, or `path-to-key-value` in the case of objects.

The big caveat being, to make sure all class names are valid, I apply the following transformation:
- All (consecutive) spaces will be replaced with a `-`.
- Any remaining invalid characters will be purged.
- The string will be made lowercase (for consistency).

Ex, for the frontmatter:
```yaml
type: Story
tags:
  - foo
  - bar
checked: true
status: In Progress
number: 42
a:
  nested:
     object:
        - value a!
        - value   b
        - [[value c]]
```

will become the classes:
- ose--type-story
- ose--tags-foo
- ose--tags-bar
- ose--checked-true
- ose--number-42
- ose--status-in-progress
- ose--a-nested-object-value-a
- ose--a-nested-object-value-b
- ose--a-nested-object-value-c
