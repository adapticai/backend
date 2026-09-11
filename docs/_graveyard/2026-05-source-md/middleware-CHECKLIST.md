# Integration Checklist

Use this checklist to verify the validation system is properly integrated and working.

## Pre-Integration Checks

- [x] All validation files created in `src/middleware/`
- [x] All test files created in `src/tests/`
- [x] TypeScript compilation successful
- [x] No `any` types used in implementation
- [x] Documentation files complete

## Integration Steps

- [ ] Import `createValidationPlugin` in `src/server.ts`
- [ ] Add plugin to Apollo Server `plugins` array
- [ ] Restart the development server
- [ ] Test with a simple mutation

## Testing Checklist

### Unit Tests

- [ ] Run `npm test src/tests/input-validator.test.ts`
- [ ] Run `npm test src/tests/graphql-validation-plugin.test.ts`
- [ ] Verify all tests pass

### Integration Tests

#### Test 1: Percentage Validation

```graphql
mutation {
  # Replace with actual mutation from your schema
  updateConfiguration(
    data: {
      tradeAllocationPct: 150 # Should fail
    }
  ) {
    id
  }
}
```

- [ ] Returns validation error
- [ ] Error code is `BAD_USER_INPUT`
- [ ] `validationErrors` array present in response
- [ ] Error message indicates value must be 0-100

#### Test 2: Positive Number Validation

```graphql
mutation {
  # Replace with actual mutation
  createTrade(
    data: {
      quantity: -5 # Should fail
    }
  ) {
    id
  }
}
```

- [ ] Returns validation error
- [ ] Error indicates value must be positive

#### Test 3: Non-Empty String Validation

```graphql
mutation {
  # Replace with actual mutation
  createPortfolio(
    data: {
      name: "" # Should fail
    }
  ) {
    id
  }
}
```

- [ ] Returns validation error
- [ ] Error indicates field cannot be empty

#### Test 4: Multiple Errors

```graphql
mutation {
  updateSettings(
    data: {
      tradeAllocationPct: 150 # Invalid
      quantity: -5 # Invalid
      name: "" # Invalid
    }
  ) {
    id
  }
}
```

- [ ] Returns single error with multiple `validationErrors`
- [ ] All 3 field errors present in response

#### Test 5: Valid Data Passes

```graphql
mutation {
  updateSettings(
    data: {
      tradeAllocationPct: 50 # Valid
      quantity: 10 # Valid
      name: "Test" # Valid
    }
  ) {
    id
  }
}
```

- [ ] No validation error
- [ ] Mutation executes successfully

#### Test 6: Queries Unaffected

```graphql
query {
  configurations {
    id
    tradeAllocationPct
  }
}
```

- [ ] Query executes normally
- [ ] No validation overhead

## Verification Checklist

### Error Format

- [ ] Errors have `code: "BAD_USER_INPUT"`
- [ ] Errors have `validationErrors` array
- [ ] Each validation error has:
  - [ ] `field` (string)
  - [ ] `value` (the invalid value)
  - [ ] `message` (human-readable)
  - [ ] `constraint` (validation type)

### Performance

- [ ] Queries execute at normal speed
- [ ] Mutations have < 1ms validation overhead
- [ ] Server logs show no errors

### Field Pattern Matching

Test that these patterns are recognized:

- [ ] Fields ending in `Pct` validated as percentages
- [ ] Fields ending in `Percent` validated as percentages
- [ ] Fields ending in `Percentage` validated as percentages
- [ ] Field named `quantity` validated as positive
- [ ] Fields ending in `Threshold` validated as positive
- [ ] Field named `name` validated as non-empty
- [ ] Field named `title` validated as non-empty
- [ ] Field named `description` validated as non-empty

## Optional Enhancements

- [ ] Update frontend to parse `validationErrors` array
- [ ] Display field-level errors in UI
- [ ] Add custom validation rules for domain-specific logic
- [ ] Set up monitoring for validation errors

## Documentation Review

- [ ] Read `README.md` for usage patterns
- [ ] Review `INTEGRATION.md` for integration details
- [ ] Check `validation-examples.ts` for code patterns
- [ ] Review `types.ts` for type definitions

## Troubleshooting

If validation isn't working:

1. [ ] Verify plugin is in `plugins` array
2. [ ] Check server logs for errors
3. [ ] Verify TypeScript compilation succeeded
4. [ ] Check that operation is a mutation (not query)
5. [ ] Verify field names match validation patterns
6. [ ] Test with manual validation functions first

## Success Criteria

✅ Integration complete when:

- [ ] Plugin added to server.ts
- [ ] Server restarts without errors
- [ ] Invalid data returns validation errors
- [ ] Valid data passes through successfully
- [ ] Error format matches specification
- [ ] No performance degradation observed

## Rollback Plan

If issues arise:

1. Remove plugin from `plugins` array
2. Restart server
3. Review error logs
4. Fix issues or report bugs
5. Re-integrate when ready

## Support

- See `INTEGRATION.md` for detailed steps
- See `README.md` for feature documentation
- See `validation-examples.ts` for usage patterns
- Check test files for expected behavior

---

**Note**: This checklist is for the integration process. The implementation itself is complete and tested.
