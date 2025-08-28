import { MaskingRule } from '../types';

export interface MaskingResult {
  masked: boolean;
  value: string;
  reason?: string;
}

export class MaskingEngine {
  private rules: MaskingRule[] = [];

  setRules(rules: MaskingRule[]): void {
    this.rules = rules;
  }

  applyMasking(
    value: string,
    classificationKey: string,
    userRoles: string[]
  ): MaskingResult {
    // Find applicable masking rules
    const applicableRules = this.rules.filter(rule => 
      rule.classificationKey === classificationKey &&
      rule.enabled &&
      userRoles.includes(rule.roleId.toString())
    );

    if (applicableRules.length === 0) {
      return { masked: false, value };
    }

    // Apply the first applicable rule (could be enhanced to handle multiple rules)
    const rule = applicableRules[0];
    const maskedValue = this.applyMaskingRule(value, rule);

    return {
      masked: true,
      value: maskedValue,
      reason: `Masked due to ${classificationKey} classification and role restrictions`
    };
  }

  private applyMaskingRule(value: string, rule: MaskingRule): string {
    switch (rule.maskingType) {
      case 'REDACT':
        return '***REDACTED***';
      
      case 'HASH':
        return this.hashValue(value);
      
      case 'PARTIAL':
        return this.partialMask(value, rule.maskingConfig);
      
      case 'CUSTOM':
        return this.customMask(value, rule.maskingConfig);
      
      default:
        return value;
    }
  }

  private hashValue(value: string): string {
    // Simple hash for demo - in production use proper cryptographic hash
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      const char = value.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `hash_${Math.abs(hash).toString(16)}`;
  }

  private partialMask(value: string, config: Record<string, unknown>): string {
    const showFirst = config.showFirst as number || 2;
    const showLast = config.showLast as number || 2;
    const maskChar = config.maskChar as string || '*';
    
    if (value.length <= showFirst + showLast) {
      return maskChar.repeat(value.length);
    }
    
    const first = value.substring(0, showFirst);
    const last = value.substring(value.length - showLast);
    const middle = maskChar.repeat(value.length - showFirst - showLast);
    
    return `${first}${middle}${last}`;
  }

  private customMask(value: string, config: Record<string, unknown>): string {
    const pattern = config.pattern as string;
    const replacement = config.replacement as string || '*';
    
    if (pattern) {
      const regex = new RegExp(pattern, 'g');
      return value.replace(regex, replacement);
    }
    
    return value;
  }

  // Utility method to check if data should be masked
  shouldMask(classificationKey: string, userRoles: string[]): boolean {
    return this.rules.some(rule => 
      rule.classificationKey === classificationKey &&
      rule.enabled &&
      userRoles.includes(rule.roleId.toString())
    );
  }
}
