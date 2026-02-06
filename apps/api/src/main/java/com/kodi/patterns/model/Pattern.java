package com.kodi.patterns.model;

public class Pattern {
    private String id;
    private String language; // java, typescript, etc.
    private String type; // naming-convention, structural-pattern, code-style
    private String scope; // class, interface, file, method, variable
    private String rule;
    private String pattern; // regex
    private String severity; // error, warning, info
    private Boolean autoFix; // true, false or null
    private Boolean disabled; // default false

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getScope() { return scope; }
    public void setScope(String scope) { this.scope = scope; }

    public String getRule() { return rule; }
    public void setRule(String rule) { this.rule = rule; }

    public String getPattern() { return pattern; }
    public void setPattern(String pattern) { this.pattern = pattern; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public Boolean getAutoFix() { return autoFix; }
    public void setAutoFix(Boolean autoFix) { this.autoFix = autoFix; }

    public Boolean getDisabled() { return disabled; }
    public void setDisabled(Boolean disabled) { this.disabled = disabled; }
}
