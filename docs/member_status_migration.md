# Member Status Migration

This document outlines the changes made to the member status options in the Smartkoop system.

## Changes Overview

The member status options have been changed from:

**Old Status Options:**
- Active
- Inactive
- Suspended

**New Status Options:**
- Calon Anggota (Prospective Member)
- Anggota (Member)
- Pengurus (Management)
- Inactive
- Suspended

## Files Modified

The following files were modified to implement these changes:

1. **Backend:**
   - `backend/app/models/member.py`: Updated the default status and comment
   - `backend/app/schemas/member.py`: Updated the default status

2. **Frontend:**
   - `frontend/src/components/members/MemberList.js`: Updated the status chip rendering
   - `frontend/src/components/members/MemberForm.js`: Updated the status dropdown options and default value
   - `frontend/src/components/members/MemberDetail.js`: Updated the status chip rendering

3. **Migration:**
   - `backend/migrate_member_status.py`: Created a migration script to update existing members

## Migration Process

The migration script maps the old status values to the new ones as follows:
- 'active' → 'anggota'
- 'inactive' and 'suspended' remain unchanged

## Running the Migration

To run the migration script:

1. Ensure you have the required dependencies installed:
   ```
   pip install sqlalchemy python-dotenv
   ```

2. Run the migration script:
   ```
   cd backend
   python migrate_member_status.py
   ```

3. The script will:
   - Count and display the number of members with the old 'active' status
   - Update these members to have the new 'anggota' status
   - Display the number of members updated
   - Commit the changes to the database

## Verification

After running the migration, you can verify the changes by:

1. Checking the database directly:
   ```sql
   SELECT status, COUNT(*) FROM member GROUP BY status;
   ```

2. Using the application UI to view member statuses in the member list and detail views.

## Rollback

If you need to rollback the changes, you can run the following SQL:

```sql
UPDATE member SET status = 'active' WHERE status = 'anggota';
```

Note: This will only rollback the data migration. The code changes would need to be reverted separately.
