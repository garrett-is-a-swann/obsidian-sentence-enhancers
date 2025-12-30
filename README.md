# Obsidian Sentence Enhancers 🧽🍍🪼🫧

An [Obsidian](https://obsidian.md/) plugin supplements the markdown editor node's class selectors with contextual information information to enhance customization by css snippets and themes.

# Classes

Obsidian Sentence Enhancers will add classes to a file's MarkdownView container element, prefixed with `ose-`. Users and theme-writers can use these classes to personalize the view of the notes.

Example:

```css
// For a very merry (and blinding) christmas!
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

## Temporal Information

I add the following css classes for temporal information:

### Month
---
Example: ose_january, ose_february, ose_march... etc

### Day of the Week
---
Example: ose_monday, ose_tuesday, ose_wednesday... etc

### Day of the Month
---
Example: ose_day-1, ose_day-2, ose_day-3... etc

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
